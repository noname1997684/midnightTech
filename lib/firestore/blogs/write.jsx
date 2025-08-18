import { deleteImage, updateImage, uploadImage } from "@/lib/cloudinary/upload";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export const createNewBlog = async (data, featureImage) => {
  if (!data.title) {
    throw new Error("Title is required");
  }
  if (!featureImage) {
    throw new Error("Feature image is required");
  }

  const newFeatureImageUrl = await uploadImage(featureImage, "products");

  const newId = doc(collection(db, `ids`)).id;
  await setDoc(doc(db, `blogs/${newId}`), {
    ...data,
    featureImageURL: newFeatureImageUrl,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};
export const updateBlog = async (data, featureImage) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!data.id) {
    throw new Error("Product Id is required");
  }

  let newFeatureImageUrl = data?.featureImageURL || null;
  if (featureImage !== newFeatureImageUrl) {
    newFeatureImageUrl = await updateImage(
      newFeatureImageUrl,
      featureImage,
      "blogs"
    );
  }

  await updateDoc(doc(db, `blogs/${data.id}`), {
    ...data,
    featureImageURL: newFeatureImageUrl,
    timestampCreate: Timestamp.now(),
  });
};

export const deleteBlog = async (id) => {
  if (!id) {
    throw new Error("Category ID is required");
  }
  try {
    const blogDoc = await getDoc(doc(db, `blogs/${id}`));
    const featureImageUrl = blogDoc.data()?.featureImageURL;
    const imageURLs = extractImageSrcs(blogDoc.data()?.content || "");
    await deleteDoc(doc(db, `blogs/${id}`));
    await deleteImage(featureImageUrl);
    for (const imageUrl of imageURLs) {
      await deleteImage(imageUrl);
    }
  } catch (error) {
    toast.error("Error deleting blogs: " + error.message);
  }
};
function extractImageSrcs(htmlString) {
  const regex = /<img[^>]+src=["']([^"']+)["']/g;
  const srcList = [];
  let match;

  while ((match = regex.exec(htmlString)) !== null) {
    srcList.push(match[1]);
  }

  return srcList;
}
