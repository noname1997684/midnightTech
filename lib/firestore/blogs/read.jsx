"use client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export function useBlogBySlug(slug) {
  const { data, error } = useSWRSubscription(
    ["blogs", slug],
    ([path, slug], { next }) => {
      const ref = collection(db, path);
      let q = query(ref, where("slug", "==", slug));

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

export function useBlog(blogId) {
  const { data, error } = useSWRSubscription(
    ["blogs", blogId],
    ([path, blogId], { next }) => {
      const ref = doc(db, `${path}/${blogId}`);

      const unsub = onSnapshot(
        ref,
        (snapshot) => next(null, snapshot.exists() ? snapshot.data() : null),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );
  return {
    data: data
      ? {
          ...data,
          timestampCreate: data.timestampCreate
            ? data.timestampCreate.toDate().toISOString()
            : null,
          timestampUpdate: data.timestampUpdate
            ? data.timestampUpdate.toDate().toISOString()
            : null,
        }
      : null,

    error: error?.message,
    isLoading: data === undefined,
  };
}

export function useBlogs(pageLimit, lastSnapDoc) {
  const { data, error } = useSWRSubscription(
    ["blogs", pageLimit, lastSnapDoc],
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

export const checkSlugExists = async (slug) => {
  const ref = collection(db, "blogs");
  const q = query(ref, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
