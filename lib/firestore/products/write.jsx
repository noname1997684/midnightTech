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

export const createNewProduct = async (data, featureImage, images) => {
  if (!data.title) {
    throw new Error("Title is required");
  }
  if (!featureImage) {
    throw new Error("Feature image is required");
  }
  if (!images || images.length === 0) {
    throw new Error("At least one image is required");
  }
  const newFeatureImageUrl = await uploadImage(featureImage, "products");
  let newImagesUrls = [];
  for (const image of images) {
    const imageUrl = await uploadImage(image, "products");
    newImagesUrls.push(imageUrl);
  }
  const newId = doc(collection(db, `ids`)).id;
  await setDoc(doc(db, `products/${newId}`), {
    ...data,
    featureImageURL: newFeatureImageUrl,
    imagesURLs: newImagesUrls,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};

export const deleteProduct = async (id) => {
  if (!id) {
    throw new Error("Category ID is required");
  }
  try {
    const productDoc = await getDoc(doc(db, `products/${id}`));
    const featureImageUrl = productDoc.data()?.featureImageURL;
    const imageURLs = productDoc.data()?.imagesURLs || [];
    await deleteDoc(doc(db, `products/${id}`));
    await deleteImage(featureImageUrl);
    for (const imageUrl of imageURLs) {
      await deleteImage(imageUrl);
    }
  } catch (error) {
    toast.error("Error deleting category: " + error.message);
  }
};

export const updateProduct = async (data, featureImage, images) => {
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
      "products"
    );
  }
  let newImagesUrls = [];

  const isImagesChanged =
    images?.length !== data.imagesURLs?.length ||
    !images.every((img, i) => img === data.imagesURLs[i]);
  if (isImagesChanged) {
    for (const image of data?.imagesURLs) {
      await deleteImage(image);
    }

    for (const image of images) {
      const imageUrl = await uploadImage(image, "products");
      newImagesUrls.push(imageUrl);
    }
  }
  await updateDoc(doc(db, `products/${data.id}`), {
    ...data,
    featureImageURL: newFeatureImageUrl,
    imagesURLs: isImagesChanged ? newImagesUrls : data.imagesURLs,
    timestampUpdate: Timestamp.now(),
  });
};
