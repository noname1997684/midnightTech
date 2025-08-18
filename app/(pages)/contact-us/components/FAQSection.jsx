"use client";
import { Button, Input } from "@heroui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";

const FAQSection = () => {
  const [email, setEmail] = useState("");
  const questions = [
    {
      title:
        "What make Midnight Tech different from other tech e-commerce platforms?",
      answer:
        "Midnight Tech stands out with its commitment to quality, customer service, and a curated selection of innovative tech products. We prioritize user experience and offer personalized recommendations to help you find the best products for your needs.",
    },
    {
      title:
        "How secure is my personal information when shopping on Midnight Tech?",
      answer:
        "We take your privacy seriously. Midnight Tech employs advanced encryption and security measures to protect your personal information. We do not share your data with third parties without your consent, ensuring a safe shopping experience.",
    },
    {
      title:
        "What is the return policy for products purchased from Midnight Tech?",
      answer:
        "Midnight Tech offers a hassle-free return policy. If you are not satisfied with your purchase, you can return it within 30 days for a full refund or exchange, provided the product is in its original condition and packaging.",
    },
    {
      title: "How can I track my order after making a purchase?",
      answer:
        "Once your order is shipped, you will receive a tracking number via email. You can use this number to track your order on our website or through the shipping carrier's website.",
    },
    {
      title: "Does Midnight Tech offer international shipping?",
      answer:
        "Yes, Midnight Tech offers international shipping to select countries. Please check our shipping policy for more details on available destinations and shipping rates.",
    },
  ];

  const handleClick = () => {
    if (!email) return;
    toast.success("Your email has been submitted! Please check your inbox.");
    setEmail("");
  };
  return (
    <section className="flex h-max px-20 py-10 justify-between items-center gap-16">
      <div className="w-1/3 flex flex-col gap-6">
        <h1 className="text-lg font-semibold">FAQ</h1>
        <h2 className="text-3xl font-bold">Do you have any questions for us</h2>
        <p className="text-gray-600 text-sm">
          If there are questions you want to ask. We will answer all of them
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button color="secondary" onClick={handleClick}>
            Send
          </Button>
        </div>
      </div>
      <div className="w-2/3">
        {questions.map((question, index) => (
          <Accordion key={index} className="mb-4" defaultExpanded={index === 0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography className="text-lg font-semibold">
                {question.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{question.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
