import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export const createCheckoutAndGetURL = async (uid, products,address) => {
  const checkoutId = doc(collection(db, `ids`)).id;
  const ref = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`);

  let line_items = [];
  products.forEach((item) => {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          description: item.product.shortDescription,
          images: [item.product.featureImageURL],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: item.product.salePrice * 100,
      },
      quantity: item.quantity,
    });
  });
  await setDoc(ref, {
    id: checkoutId,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: line_items,
    metadata: {
      checkoutId: checkoutId,
      uid: uid,
      address: JSON.stringify(address),
    },
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-success?checkout_id=${checkoutId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-failed?checkout_id=${checkoutId}`,
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const checkoutSession = await getDoc(ref)
  if (!checkoutSession.exists()) {
    throw new Error("Checkout session not found");
  }

  if(checkoutSession.data().error?.message){
    throw new Error(checkoutSession.data().error?.message);
  }

  const url = checkoutSession.data().url;

  if(url){
    return url
  } else{
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const checkoutSession = await getDoc(ref);

    if(checkoutSession.data().error?.message){
    throw new Error(checkoutSession.data().error.message);
  }
    if(checkoutSession.data().url){
      return checkoutSession.data().url;
    } else{
      await new Promise((resolve) => setTimeout(resolve, 5000));
    const checkoutSession = await getDoc(ref);

    if(checkoutSession.data().error?.message){
    throw new Error(checkoutSession.data().error.message);
  }
    if(checkoutSession.data().url){
      return checkoutSession.data().url;
    } else{
      throw new Error("Checkout session URL not found! Please try again later.");
    }
    }
  }
};
export const createCheckoutCODAndGetId = async (uid, products,address) => {
  const checkoutId = `cod_${doc(collection(db, `ids`)).id}`;
  const ref = doc(db, `users/${uid}/checkout_sessions_cod/${checkoutId}`);

  let line_items = [];
  products.forEach((item) => {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          description: item.product.shortDescription,
          images: [item.product.featureImageURL],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: item.product.salePrice * 100,
      },
      quantity: item.quantity,
    });
  });
  await setDoc(ref, {
    id: checkoutId,
    
    line_items: line_items,
    metadata: {
      checkoutId: checkoutId,
      uid: uid,
      address: JSON.stringify(address),
    },
    createdAt: Timestamp.now(),
  });
  return checkoutId;
};
