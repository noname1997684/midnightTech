import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getUser = async (id) => {
  const data = await getDoc(doc(db, `users/${id}`));

  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};
