import { collection, deleteDoc, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { deleteImage, updateImage, uploadImage } from "@/lib/cloudinary/upload";
import toast from "react-hot-toast";


export const createNewCollection = async (data, image) =>{
    try {
        
   
    if(!image){
        throw new Error("Image is required");
    }
    if(!data.title){
        throw new Error("Title is required");
    }
    if(!data.products || data.products.length === 0){
        throw new Error("Products is required");
    }
    const newId = doc(collection(db,`ids`)).id;
    const imageUrl = await uploadImage(image,'collections');
    await setDoc(doc(db, `collections/${newId}`), {
        ...data,
        imageURL: imageUrl,
        id: newId,
        timestampCreate: Timestamp.now(),
    })
     } catch (error) {
        toast.error("Error creating collection: " + error.message);
    }
}
export const updateCollection = async (data,image) =>{
    try {
    if(!data.id){
        throw new Error("Category ID is required");
    }
    if(!data.title){
        throw new Error("Title is required");
    }
    if(!data.products || data.products.length === 0){
        throw new Error("Products is required");
    }
    const id = data.id;
    let imageUrl = data.imageURL || null;
    if(image){
        imageUrl = await updateImage(imageUrl,image,'collections');
    }
    await updateDoc(doc(db, `collections/${id}`), {
        ...data,
        imageURL: imageUrl,
        timestampCreate: Timestamp.now(),
    })
     } catch (error) {
        toast.error("Error updating collection: " + error.message);
    }
}

export const deleteCollection = async (id) => {
    if(!id){
        throw new Error("Collection ID is required");
    }
    try {
        const collectionDoc = await getDoc(doc(db, `collections/${id}`));
        const imageURL = collectionDoc.data()?.imageURL;
        await deleteDoc(doc(db, `collections/${id}`));
        await deleteImage(imageURL);
    } catch (error) {
        toast.error("Error deleting collection: " + error.message);
    }
}