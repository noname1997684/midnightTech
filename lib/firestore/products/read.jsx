"use client";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
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
                ? null
                : snapshot.docs.map((snap) => snap.data()),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
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
