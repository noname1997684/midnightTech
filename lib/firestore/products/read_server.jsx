import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";

export const getProduct = async (id) => {
  const data = await getDoc(doc(db, `products/${id}`));

  if (data.exists()) {
    return {
      ...data.data(),
      id: data.id,
      timestampCreate: data.timestampCreate
        ? data.timestampCreate.toDate().toISOString()
        : null,
      timestampUpdate: data.timestampUpdate
        ? data.timestampUpdate.toDate().toISOString()
        : null,
    };
  } else {
    return null;
  }
};

export const getFeaturedProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isFeatured", "==", true))
  );
  return list.docs.map((snap) => {
    const data = snap.data();
    return {
      ...data,
      id: snap.id,
      timestampCreate: data.timestampCreate
        ? data.timestampCreate.toDate().toISOString()
        : null,
      timestampUpdate: data.timestampUpdate
        ? data.timestampUpdate.toDate().toISOString()
        : null,
    };
  });
};

export const getProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  return list.docs.map((snap) => {
    const data = snap.data();
    return {
      ...data,
      id: snap.id,
      timestampCreate: data.timestampCreate
        ? data.timestampCreate.toDate().toISOString()
        : null,
      timestampUpdate: data.timestampUpdate
        ? data.timestampUpdate.toDate().toISOString()
        : null,
    };
  });
};

export const getProductsByCategory = async (
  categoryId,
  pageLimit = 10,
  lastSnapDoc = null
) => {
  let q = query(
    collection(db, "products"),
    orderBy("timestampCreate", "desc"),
    where("categoryId", "==", categoryId),
    limit(pageLimit + 1) // Lấy thêm 1 để kiểm tra có trang tiếp theo
  );

  if (lastSnapDoc) {
    q = query(q, startAfter(lastSnapDoc));
  }

  const list = await getDocs(q);
  const products = list.docs.map((snap) => {
    const data = snap.data();
    return {
      ...data,
      id: snap.id,
      timestampCreate: data.timestampCreate
        ? data.timestampCreate.toDate().toISOString()
        : null,
      timestampUpdate: data.timestampUpdate
        ? data.timestampUpdate.toDate().toISOString()
        : null,
    };
  });

  return {
    products: JSON.parse(JSON.stringify(products.slice(0, pageLimit))),
    hasNextPage: products.length > pageLimit,
  };
};
export const getProductsByBrands = async (
  brandId,
  pageLimit = 10,
  lastSnapDoc = null
) => {
  let q = query(
    collection(db, "products"),
    orderBy("timestampCreate", "desc"),
    where("brandId", "==", brandId),
    limit(pageLimit + 1) // Lấy thêm 1 để kiểm tra có trang tiếp theo
  );

  if (lastSnapDoc) {
    q = query(q, startAfter(lastSnapDoc));
  }

  const list = await getDocs(q);
  const products = list.docs.map((snap) => {
    const data = snap.data();
    return {
      ...data,
      id: snap.id,
      timestampCreate: data.timestampCreate
        ? data.timestampCreate.toDate().toISOString()
        : null,
      timestampUpdate: data.timestampUpdate
        ? data.timestampUpdate.toDate().toISOString()
        : null,
    };
  });

  return {
    products: JSON.parse(JSON.stringify(products.slice(0, pageLimit))),
    hasNextPage: products.length > pageLimit,
  };
};
