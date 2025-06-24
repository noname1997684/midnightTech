import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { admin, adminDB } from "@/lib/firestore/firebase_admin";
import Link from "next/link";
import React from "react";


const fetchCheckout = async (checkoutId) => {
    
        const list = await adminDB
          .collectionGroup("checkout_sessions_cod")
          .where("id", "==", checkoutId)
          .get();
        if (list.docs.length === 0) {
          throw new Error("Checkout not found");
        }
        return list.docs[0].data();
        
    
};

const processOrder = async ( checkout) => {
    const uid = checkout.metadata.uid;
  const order = await adminDB.doc(`orders/${checkout.id}`).get();
  if (order.exists) {
    return false;
  }
  await adminDB.doc(`orders/${checkout.id}`).set({
    checkout:checkout,
    payment:{
      amount: checkout.line_items.reduce((total, item) => {
        return total + item.price_data.unit_amount * item.quantity;
      },0)
    },
    uid:uid,
    id: checkout.id,
    paymentMode: "cod",
    timestampCreated:admin.firestore.Timestamp.now(),
  });

  const productsList = checkout.line_items.map((item) => {
    return {
      productId: item.price_data.product_data.metadata.productId,
      quantity: item.quantity,
    };
  })
  const user = await adminDB.doc(`users/${uid}`).get();
  const productIdsList = productsList.map((item) => item.productId);
  const newCartList = (user.data().carts || []).filter(
    (cartItem) => !productIdsList.includes(cartItem.id)
  );

    await adminDB.doc(`users/${uid}`).set({
        carts: newCartList,
    }, { merge: true });

    const batch = adminDB.batch();
    productsList.forEach((item)=>{
        batch.update(adminDB.doc(`products/${item.productId}`), {
            orders: admin.firestore.FieldValue.increment(item.quantity),
        })
    })

    await batch.commit();
    return true;
};

const page = async ({ searchParams }) => {
  const {checkout_id} = searchParams;
  
  const checkout =await fetchCheckout(checkout_id);
 
  const result = await processOrder(checkout);
  return (
    <main>
      <Header />
      
      <section className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex justify-center items-center w-full">
          <img src="/svg/failed.svg" alt="failed" className="h-48" />
        </div>
        <h1 className="text-2xl font-semibold ">
          Your Order Is{" "}
          <span className="font-bold text-green-600">Succesfully</span> Placed
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href={"/account"}>
            <button className="text-blue-600 border border-blue-600 px-5 py-2 rounded-lg bg-white">
              Go to Orders Page
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default page;
