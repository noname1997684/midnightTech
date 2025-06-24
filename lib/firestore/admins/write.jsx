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
import { deleteImage, updateImage, uploadImage } from "@/lib/cloudinary/upload";
import toast from "react-hot-toast";

export const createNewAdmin = async (data, image) => {
  try {
    if (!image) {
      throw new Error("Image is required");
    }
    if (!data.name) {
      throw new Error("Name is required");
    }
    if (!data.email) {
      throw new Error("Email is required");
    }

    const newId = data.email;
    const imageUrl = await uploadImage(image, "admins");
    await setDoc(doc(db, `admins/${newId}`), {
      ...data,
      imageURL: imageUrl,
      id: newId,
      timestampCreate: Timestamp.now(),
    });
  } catch (error) {
    toast.error("Error creating admin: " + error.message);
  }
};
export const updateAdmin = async (data, image) => {
  try {
    if (!data.id) {
      throw new Error("Admin ID is required");
    }
    if (!data.name) {
      throw new Error("Name is required");
    }
    if (!data.email) {
      throw new Error("Email is required");
    }

    const id = data.id;
    let imageUrl = data.imageURL || null;
    if (image) {
      imageUrl = await updateImage(imageUrl, image, "admins");
    }
    if (id === data.email) {
      await updateDoc(doc(db, `admins/${id}`), {
        ...data,
        imageURL: imageUrl,
        timestampCreate: Timestamp.now(),
      });
    } else{
        const newId= data.email;
        await deleteDoc(doc(db, `admins/${id}`));
        await setDoc(doc(db, `admins/${newId}`), {
          ...data,
          imageURL: imageUrl,
          id: newId,
          timestampCreate: Timestamp.now(),
        });
    }
  } catch (error) {
    toast.error("Error updating admin: " + error.message);
  }
};

export const deleteAdmin = async (id) => {
  if (!id) {
    throw new Error("Admin ID is required");
  }
  try {
    const adminDoc = await getDoc(doc(db, `admins/${id}`));
    const imageURL = adminDoc.data()?.imageURL;
    await deleteDoc(doc(db, `admins/${id}`));
    await deleteImage(imageURL);
  } catch (error) {
    toast.error("Error deleting admin: " + error.message);
  }
};
