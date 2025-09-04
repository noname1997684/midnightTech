import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const getBlog = async (id) => {
  const data = await getDoc(doc(db, `blogs/${id}`));

  if (data.exists()) {
    return {
      ...data.data(),
      id: data.id,
      timestampCreate: data.data().timestampCreate
        ? data.data().timestampCreate.toDate().toISOString()
        : null,
      timestampUpdate: data.data().timestampUpdate
        ? data.data().timestampUpdate.toDate().toISOString()
        : null,
    };
  } else {
    return null;
  }
};

export const getFeaturedBlogs = async () => {
  const list = await getDocs(
    query(collection(db, "blogs"), where("isFeatured", "==", true))
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

export const getBlogs = async ({
  category = null,
  pageLimit = 10,
  lastSnapDoc = null,
  searchQuery = null,
}) => {
  let q;
  if (category) {
    q = query(
      collection(db, "blogs"),
      orderBy("timestampCreate", "desc"),
      where("category", "==", category),
      limit(pageLimit + 1)
    );
  } else if (searchQuery) {
    q = query(
      collection(db, "blogs"),
      orderBy("timestampCreate", "desc"),
      where("title", "array-contains", searchQuery),
      limit(pageLimit + 1)
    );
  } else {
    q = query(
      collection(db, "blogs"),
      orderBy("timestampCreate", "desc"),
      limit(pageLimit + 1)
    );
  }
  if (lastSnapDoc) {
    q = query(q, startAfter(lastSnapDoc));
  }
  const list = await getDocs(q);
  const blogs = list.docs.map((snap) => {
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
    blogs: JSON.parse(JSON.stringify(blogs.slice(0, pageLimit))),
    hasNextPage: blogs.length > pageLimit,
  };
};
