"use client";

import { updateOrderStatus } from "@/lib/firestore/orders/write";
import toast from "react-hot-toast";

const ChangeStatus = ({ order }) => {
  const handleChangeStatus = async (status) => {

    try {
        if (!status) {
            toast.error("Please select a status");
            
        }
      await toast.promise(updateOrderStatus(order.id, status), {
        error: (e) => e.message,
        loading: "Updating order status...",
        success: "Order status updated successfully",
      });
    } catch (error) {
      toast.error("Failed to update order status" + error.message);
    }
  };
  return (
    <select
      value={order.status}
      name="change-order-status"
      id="change-order-status"
      className="px-4 py-2 border rounded-lg bg-white"
        onChange={(e) => handleChangeStatus(e.target.value)}
    >
      <option value="">UpdateStatus</option>
      <option value="pending">Pending</option>
      <option value="packed">Packed</option>
      <option value="pick up">Pick Up</option>
      <option value="in transit">In Transit</option>
      <option value="out for delivery">Out For Delivery</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
};

export default ChangeStatus;
