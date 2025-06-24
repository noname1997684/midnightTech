import { collection, deleteDoc, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { deleteImage, updateImage, uploadImage } from "@/lib/cloudinary/upload";
import toast from "react-hot-toast";


export const createNewBrand = async (data, image) =>{
    try {
        
   
    if(!image){
        throw new Error("Image is required");
    }
    if(!data.name){
        throw new Error("Name is required");
    }

    const newId = doc(collection(db,`ids`)).id;
    const imageUrl = await uploadImage(image,'brands')
    await setDoc(doc(db, `brands/${newId}`), {
        ...data,
        imageURL: imageUrl,
        id: newId,
        timestampCreate: Timestamp.now(),
    })
     } catch (error) {
        toast.error("Error creating brand: " + error.message);
    }
}
export const updateBrand = async (data,image) =>{
    try {
    if(!data.id){
        throw new Error("Brand ID is required");
    }
    if(!data.name){
        throw new Error("Name is required");
    }

    const id = data.id;
    let imageUrl = data.imageURL || null;
    if(image){
        imageUrl = await updateImage(imageUrl,image,'brands');
    }
    await updateDoc(doc(db, `brands/${id}`), {
        ...data,
        imageURL: imageUrl,
        timestampCreate: Timestamp.now(),
    })
     } catch (error) {
        toast.error("Error updating brand: " + error.message);
    }
}

export const deleteBrand = async (id) => {
    if(!id){
        throw new Error("Brand ID is required");
    }
    try {
        const brandDoc = await getDoc(doc(db, `brands/${id}`));
        const imageURL = brandDoc.data()?.imageURL;
        await deleteDoc(doc(db, `brands/${id}`));
        await deleteImage(imageURL);
    } catch (error) {
        toast.error("Error deleting brand: " + error.message);
    }
}