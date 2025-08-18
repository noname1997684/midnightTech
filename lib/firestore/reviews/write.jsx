import { deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export const addReviews = async ({
  uid,
  rating,
  message,
  productId,
  displayName,
  photoURL,
}) => {
  const ref = doc(db, `products/${productId}/reviews/${uid}`);
  await setDoc(ref, {
    rating,
    message,
    productId,
    uid,
    displayName,
    photoURL,
    timestamp: Timestamp.now(),
  });
};

export const addReviewsBlog = async ({
  uid,
  message,
  blogId,
  displayName,
  photoURL,
}) => {
  const ref = doc(db, `blogs/${blogId}/reviews/${uid}`);
  await setDoc(ref, {
    message,
    blogId,
    uid,
    displayName,
    photoURL,
    timestamp: Timestamp.now(),
  });
};

export const deleteReview = async (uid, productId) => {
  const ref = doc(db, `products/${productId}/reviews/${uid}`);
  await deleteDoc(ref);
};
