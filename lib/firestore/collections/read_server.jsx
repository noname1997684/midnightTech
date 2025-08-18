import { collection, doc, getDoc, getDocs, query } from "firebase/firestore"
import { db } from "../firebase";

export const getCollection= async (id) => {
  
    const data =await getDoc(doc(db, `collections/${id}`));
      
    if(  data.exists()){
        return data.data();
    }
    else{
        return null;
    }
}

export const getCollections= async () => {
  
    const list =await getDocs(collection(db, "collections"));
    return list.docs.map((snap)=>{
            const data=snap.data()
            return {
                ...data,
                id: snap.id,
                timestampCreate: data.timestampCreate ? data.timestampCreate.toDate().toISOString() : null,
            }
    });

}