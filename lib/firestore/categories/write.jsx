import { collection, deleteDoc, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { deleteImage, updateImage, uploadImage } from "@/lib/cloudinary/upload";
import toast from "react-hot-toast";


export const createNewcategory = async (data, image) =>{
    try {
        
   
    if(!image){
        throw new Error("Image is required");
    }
    if(!data.name){
        throw new Error("Name is required");
    }
    if(!data.slug){
        throw new Error("Slug is required");
    }
    const newId = doc(collection(db,`ids`)).id;
    const imageUrl = await uploadImage(image,'categories')
    await setDoc(doc(db, `categories/${newId}`), {
        ...data,
        imageURL: imageUrl,
        id: newId,
        timestampCreate: Timestamp.now(),
    })
     } catch (error) {
        toast.error("Error creating category: " + error.message);
    }
}
export const updateCategory = async (data,image) =>{
    try {
    if(!data.id){
        throw new Error("Category ID is required");
    }
    if(!data.name){
        throw new Error("Name is required");
    }
    if(!data.slug){
        throw new Error("Slug is required");
    }
    const id = data.id;
    let imageUrl = data.imageURL || null;
    if(image){
        imageUrl = await updateImage(imageUrl,image,'categories');
    }
    await updateDoc(doc(db, `categories/${id}`), {
        ...data,
        imageURL: imageUrl,
        timestampCreate: Timestamp.now(),
    })
     } catch (error) {
        toast.error("Error creating category: " + error.message);
    }
}

export const deleteCategory = async (id) => {
    if(!id){
        throw new Error("Category ID is required");
    }
    try {
        const categoryDoc = await getDoc(doc(db, `categories/${id}`));
        const imageURL = categoryDoc.data()?.imageURL;
        await deleteDoc(doc(db, `categories/${id}`));
        await deleteImage(imageURL);
    } catch (error) {
        toast.error("Error deleting category: " + error.message);
    }
}