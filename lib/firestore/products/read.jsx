"use client";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
  getDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import { db } from "../firebase";

export function useProducts(pageLimit, lastSnapDoc) {
  const { data, error } = useSWRSubscription(
    ["products", pageLimit, lastSnapDoc],
    ([path, pageLimit, lastSnapDoc], { next }) => {
      const ref = collection(db, path);
      let q = query(ref, limit(pageLimit || 10));
      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }
      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? []
                : snapshot.docs.map((snap) => snap.data()),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
            length: snapshot.docs.length,
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    length: data?.length,
    isLoading: data === undefined,
  };
}
export function useProductsFilter(filter, pageLimit, lastSnapDoc) {
  console.log("Products Filter:", filter);
  const { data, error } = useSWRSubscription(
    ["products", filter, pageLimit, lastSnapDoc],
    ([path, filter, pageLimit, lastSnapDoc], { next }) => {
      const ref = collection(db, path);
      let q = query(ref);
      if (filter?.categories?.length > 0) {
        q = query(q, where("categoryId", "in", filter.categories));
      }
      if (filter?.brands?.length > 0) {
        q = query(q, where("brandId", "in", filter.brands));
      }
      if (filter?.price?.range) {
        q = query(
          q,
          where("price", ">=", filter.price.range[0]),
          where(
            "price",
            "<=",
            filter.price.range[1] === Infinity
              ? 100000000
              : filter.price.range[1]
          )
        );
      }
      if (
        !filter?.categories?.length &&
        !filter?.brands?.length &&
        !filter?.price?.range
      ) {
        q = query(
          ref,
          ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
          limit(pageLimit || 10)
        );
      }
      switch (filter?.sort) {
        case "price-asc":
          q = query(
            q,
            orderBy("price", "asc"),
            ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
            limit(pageLimit || 10)
          );
          break;
        case "price-desc":
          q = query(
            q,
            orderBy("price", "desc"),
            ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
            limit(pageLimit || 10)
          );
          break;
        case "date-asc":
          q = query(
            q,
            orderBy("timestampCreate", "asc"),
            ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
            limit(pageLimit || 10)
          );
          break;
        case "date-desc":
          q = query(
            q,
            orderBy("timestampCreate", "desc"),
            ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
            limit(pageLimit || 10)
          );
          break;
        case "name-asc":
          q = query(
            q,
            orderBy("title", "asc"),
            ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
            limit(pageLimit || 10)
          );
          break;
        case "name-desc":
          q = query(
            q,
            orderBy("title", "desc"),
            ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
            limit(pageLimit || 10)
          );
          break;
        default:
          q = query(
            q,
            ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
            limit(pageLimit || 10)
          );
      }

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? []
                : snapshot.docs.map((snap) => snap.data()),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
            length: snapshot.docs.length,
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );
  console.log("Products Filter Data:", data);
  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    length: data?.length,
    isLoading: data === undefined,
  };
}

export function useProduct(productId) {
  const { data, error } = useSWRSubscription(
    ["products", productId],
    ([path, productId], { next }) => {
      const ref = doc(db, `${path}/${productId}`);

      const unsub = onSnapshot(
        ref,
        (snapshot) => next(null, snapshot.exists() ? snapshot.data() : null),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data,

    error: error?.message,
    isLoading: data === undefined,
  };
}

export function useProductsById(listId) {
  const { data, error } = useSWRSubscription(
    ["products", listId],
    ([path, listId], { next }) => {
      const ref = collection(db, path);
      let q = query(ref, where("id", "in", listId));

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? []
              : snapshot.docs.map((snap) => snap.data())
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data,
    error: error?.message,
    isLoading: data === undefined,
  };
}

export function useGetProductsByLikeandOrder(userId) {
  const { data, error } = useSWRSubscription(
    userId ? ["products-like", userId] : null,
    ([path, userId], { next }) => {
      // Remove async from here
      const fetchRelatedProducts = async () => {
        try {
          const userDoc = await getDoc(doc(db, `users/${userId}`));
          if (!userDoc.exists()) {
            next(null, []);
            return;
          }
          const userData = userDoc.data();

          const favorites = userData.favorites || [];

          if (!favorites || favorites.length === 0) {
            next(null, []);
            return;
          }

          const relatedProducts = [];
          const seenProductIds = new Set();

          // Get original products
          const originalProducts = await Promise.all(
            favorites.map(async (id) => {
              const data = await getDoc(doc(db, `products/${id}`));
              return data.exists() ? { id: data.id, ...data.data() } : null;
            })
          );
          // Collect unique categoryIds và brandIds
          const categoryIds = [
            ...new Set(
              originalProducts.filter((p) => p).map((p) => p.categoryId)
            ),
          ];

          const brandIds = [
            ...new Set(originalProducts.filter((p) => p).map((p) => p.brandId)),
          ];

          // Get products by category and brand in parallel
          const [categoryProducts, brandProducts] = await Promise.all([
            // Get products by categories
            Promise.all(
              categoryIds.map((categoryId) =>
                getDocs(
                  query(
                    collection(db, "products"),
                    where("categoryId", "==", categoryId),
                    limit(10)
                  )
                )
              )
            ),
            // Get products by brands
            Promise.all(
              brandIds.map((brandId) =>
                getDocs(
                  query(
                    collection(db, "products"),
                    where("brandId", "==", brandId),
                    limit(10)
                  )
                )
              )
            ),
          ]);

          // Process category results
          categoryProducts.forEach((snapshot) => {
            snapshot.docs.forEach((snap) => {
              const productId = snap.id;
              if (
                !seenProductIds.has(productId) &&
                !favorites.includes(productId)
              ) {
                const data = snap.data();
                relatedProducts.push({
                  ...data,
                  id: productId,
                  relationType: "category",
                  timestampCreate: data.timestampCreate
                    ? data.timestampCreate.toDate().toISOString()
                    : null,
                  timestampUpdate: data.timestampUpdate
                    ? data.timestampUpdate.toDate().toISOString()
                    : null,
                });
                seenProductIds.add(productId);
              }
            });
          });

          // Process brand results
          brandProducts.forEach((snapshot) => {
            snapshot.docs.forEach((snap) => {
              const productId = snap.id;
              if (
                !seenProductIds.has(productId) &&
                !favorites.includes(productId)
              ) {
                const data = snap.data();
                relatedProducts.push({
                  ...data,
                  id: productId,
                  relationType: "brand",
                  timestampCreate: data.timestampCreate
                    ? data.timestampCreate.toDate().toISOString()
                    : null,
                  timestampUpdate: data.timestampUpdate
                    ? data.timestampUpdate.toDate().toISOString()
                    : null,
                });
                seenProductIds.add(productId);
              }
            });
          });
          console.log("Related Products:", relatedProducts);
          next(null, relatedProducts);
        } catch (error) {
          console.error("Error fetching related products:", error);
          next(error, []);
        }
      };

      // Call the async function
      fetchRelatedProducts();

      // Return unsubscribe function (required by useSWRSubscription)
      return () => {
        // No cleanup needed for one-time fetch
        console.log("Cleanup for products-like subscription");
      };
    }
  );

  return {
    data: data || [],
    error: error?.message,
    isLoading: data === undefined,
  };
}

export const useProductRankByOrder = (pageLimit, lastSnapDoc) => {
  const { data, error } = useSWRSubscription(
    ["products-rank-order", pageLimit, lastSnapDoc],
    ([path, pageLimit, lastSnapDoc], { next }) => {
      const ref = collection(db, "products");
      let q = query(
        ref,
        orderBy("orders", "desc"),
        ...(lastSnapDoc ? [startAfter(lastSnapDoc)] : []),
        limit(pageLimit || 10)
      );

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? []
                : snapshot.docs.map((snap) => ({
                    id: snap.id,
                    ...snap.data(),
                  })),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
            length: snapshot.docs.length,
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    length: data?.length,
    isLoading: data === undefined,
  };
};
