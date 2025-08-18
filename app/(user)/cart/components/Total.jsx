import { useProductsById } from "@/lib/firestore/products/read";
import React from "react";

const Total = ({ productIdsList, item }) => {
  const { data: products, error, isLoading } = useProductsById(productIdsList);
  const totalPrice = products?.reduce((total, product) => {
    const cartItem = item.find((item) => item.id === product.id);
    return (
      total +
      (product.salePrice ? product.salePrice : product.price) *
        (cartItem?.quantity || 0)
    );
  }, 0);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <section className="w-full p-5 bg-orange-300 text-black rounded-lg shadow-lg">
      <h1 className="text-lg font-bold text-center">Cart Total</h1>
      <div className="flex justify-between items-center">
        <span>SubTotal:</span>
        <span>${totalPrice.toFixed(0)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Discount:</span>
        <span>0$</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Shipping:</span>
        <span>Free</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Total Price:</span>
        <span>${totalPrice.toFixed(0)}</span>
      </div>
    </section>
  );
};

export default Total;
