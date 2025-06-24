"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

const SuccessMesage = () => {
useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
},[])

    return (
    <></>
  )
}

export default SuccessMesage