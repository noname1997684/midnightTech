import { doc, Timestamp, updateDoc } from "firebase/firestore"
import { db } from "../firebase"

export const updateOrderStatus = async (orderId, status) => {
    await updateDoc(doc(db,`orders/${orderId}`), {
        status: status,
        timestampStatusUpdated: Timestamp.now()
    })
}