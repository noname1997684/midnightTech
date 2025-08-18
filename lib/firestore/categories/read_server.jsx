import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../firebase";

export const getCategory= async (id) => {
  
    const data =await getDoc(doc(db, `categories/${id}`));
      
    if(  data.exists()){
        return data.data();
    }
    else{
        return null;
    }
}
export const getCategories= async () => {
  
    const list =await getDocs(collection(db, "categories"));
    return list.docs.map((snap)=>{
         const data = snap.data();
        return {
            ...data,
            id: snap.id,
            timestampCreate: data.timestampCreate ? data.timestampCreate.toDate().toISOString()  : null,
        }
    });

}