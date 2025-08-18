import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { updateImage, uploadImage } from "@/lib/cloudinary/upload";

export const createUser = async ({ uid, displayName, photoURL }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      displayName: displayName,
      photoURL: photoURL || "",
      timestampCreated: Timestamp.now(),
    },
    {
      merge: true,
    }
  );
};
export const updateUser = async ({ uid, data, photoURL }) => {
  try {
    if (!uid) throw new Error("User ID is required");
    let imageUrl = data.photoURL || null;
    if (photoURL) {
      if (
        !imageUrl ||
        imageUrl === "" ||
        imageUrl.includes("lh3.googleusercontent.com")
      ) {
        imageUrl = await uploadImage(photoURL, "users");
      } else {
        imageUrl = await updateImage(imageUrl, photoURL, "users");
      }
    }
    console.log("Updating user:", {
      uid: uid,
      data: data,
      photoURL: imageUrl,
    });
    await updateDoc(doc(db, `users/${uid}`), {
      ...data,
      photoURL: imageUrl,
      timestampUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};

export const updateFavorites = async (uid, list) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      favorites: list,
    },
    {
      merge: true,
    }
  );
};

export const updateSavedPosts = async (uid, list) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      savedPosts: list,
    },
    {
      merge: true,
    }
  );
};

export const updateCarts = async (uid, list) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      carts: list,
    },
    {
      merge: true,
    }
  );
};

export const updateAddress = async ({ uid, data }) => {
  console.log(data);
  await setDoc(
    doc(db, `users/${uid}`),
    {
      address: data,
    },
    {
      merge: true,
    }
  );
};
