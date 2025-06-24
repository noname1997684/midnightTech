"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createCheckoutAndGetURL, createCheckoutCODAndGetId } from "@/lib/firestore/checkout/write";
import { Button } from "@heroui/react";
import confetti from "canvas-confetti";

import { CheckSquare2Icon, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Checkout = ({ producList }) => {
  const [paymentMode, setPaymentMode] = useState("prepaid");
  const [address, setAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const router =useRouter()
  const {user}= useAuth()
  const totalPrice = producList.reduce((acc, item) => {
    return acc + item.product.salePrice * item.quantity;
  }, 0);

  const handleAddress =(key, value) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const handlePlaceOrder =async () => {
    setIsLoading(true);
    
    try {
        if(totalPrice <= 0) {
            throw new Error("Total price must be greater than zero.");
        }
        if(!address || !address.fullName || !address.mobile || !address.email || !address.addressLine1 || !address.pincode || !address.city || !address.state) {
            throw new Error("Please fill all the address fields.");
        }

        if(!producList || producList.length === 0) {
            throw new Error("No products in the cart.");
        }

        if(paymentMode === "prepaid") {
          const url=await createCheckoutAndGetURL(user.uid, producList,address)
          router.push(url);
        } else{
            const checkoutId = await createCheckoutCODAndGetId(user.uid, producList,address)
          router.push(`/checkout-cod?checkout_id=${checkoutId}`)
        }
        toast.success("Order placed successfully!"); 
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        })
    } catch (error) {
        toast.error("Failed to place order. Please try again later." + error.message);
    } finally{
        setIsLoading(false);
    }
  }

  return (
    <section className="flex gap-3 flex-col md:flex-row">
      <section className="flex-1 border rounded-xl p-4 flex flex-col gap-4">
        <h1 className="text-xl">Shipping Address</h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            id="full-name"
            name="full-name"
            placeholder="Full Name"
            value={address?.fullName || ""}
            onChange={(e) => handleAddress("fullName", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="Mobile Number"
            value={address?.mobile || ""}
            onChange={(e) => handleAddress("mobile", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email"
            value={address?.email || ""}
            onChange={(e) => handleAddress("email", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          <input
            type="text"
            id="address-line-1"
            name="address-line-1"
            placeholder="Enter Address Line 1"
            value={address?.addressLine1 || ""}
            onChange={(e) => handleAddress("addressLine1", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          <input
            type="text"
            id="address-line-2"
            name="address-line-2"
            placeholder="Enter Address Line 2"
            value={address?.addressLine2 || ""}
            onChange={(e) => handleAddress("addressLine2", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          <input
            type="text"
            id="pincode"
            name="pincode"
            placeholder="Enter Pincode"
            value={address?.pincode || ""}
            onChange={(e) => handleAddress("pincode", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter City"
            value={address?.city || ""}
            onChange={(e) => handleAddress("city", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          <input
            type="text"
            id="state"
            name="state"
            placeholder="Enter State"
            value={address?.state || ""}
            onChange={(e) => handleAddress("state", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          <textarea
            type="text"
            id="delivery-notes"
            name="delivery-notes"
            placeholder="Notes about your order"
            value={address?.orderNote || ""}
            onChange={(e) => handleAddress("orderNote", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
      </section>
      <div className="flex flex-col gap-3 flex-1 ">
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <h1 className="text-xl">Products</h1>
          <div className="flex flex-col gap-2">
            {producList.map((item) => (
              <div className="flex gap-3 items-center">
                <img
                  className="w-10 h-10 object-cover rounded-lg"
                  src={item.product.featureImageURL}
                  alt={item.product.title}
                />
                <div className="flex-1 flex flex-col">
                  <h1 className="text-sm">{item.product.title}</h1>
                  <h3 className="text-green-600 font-semibold text-[10px]">
                    $ {item.product.salePrice}{" "}
                    <span className="text-black">X</span>{" "}
                    <span className="text-gray-600">{item.quantity}</span>
                  </h3>
                </div>
                <div>
                  <h3 className="text-sm">
                    $ {item.product.salePrice * item.quantity}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full items-center p-2 font-semibold">
            <h1>Total</h1>
            <h1>$ {totalPrice}</h1>
          </div>
        </section>
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <h2 className="text-xl">Payment Mode</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaymentMode("prepaid")}
                className="flex items-center gap-1 text-xs"
              >
                {paymentMode === "prepaid" ? (
                  <CheckSquare2Icon className="text-blue-500" size={13} />
                ) : (
                  <Square size={13} />
                )}{" "}
                Prepaid
              </button>
              <button
                onClick={() => setPaymentMode("cod")}
                className="flex items-center gap-1 text-xs"
              >
                {paymentMode !== "prepaid" ? (
                  <CheckSquare2Icon className="text-blue-500" size={13} />
                ) : (
                  <Square size={13} />
                )}{" "}
                Cash On Delivery
              </button>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <CheckSquare2Icon className="text-blue-500" size={13} />
            <h4 className="text-xs text-gray-600">
              I agree with the{" "}
              <span className="text-blue-700">term & conditions</span>
            </h4>
          </div>
          <Button isLoading={isLoading} isDisabled={isLoading} onClick={handlePlaceOrder} className="bg-black text-white">Place Order</Button>
        </section>
      </div>
    </section>
  );
};

export default Checkout;
