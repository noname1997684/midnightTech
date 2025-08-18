"use client";
import { Button, Input, Textarea } from "@heroui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ContactSection = () => {
  const [data, setData] = useState(null);
  const handleData = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const contact = [
    {
      title: "Customer Support",
      description:
        "Our support team is available around the clock to address any concerns or questions you may have",
    },
    {
      title: "Feedback and Suggestions",
      description:
        "We value your feadback and are continuously working to improve Midnight Tech. Your input is crucial in shaping the future of our products and services.",
    },
    {
      title: "Media Inquiries",
      description:
        "For media-related questions or press inquiries, please contact us at midnightech@gmail.com",
    },
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you for contacting us!");
    setData(null);
  };
  return (
    <section className="flex min-h-screen bg-violet-200 px-20 py-10 justify-between items-center gap-8">
      <div className="w-3/5 flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="w-96">
            Email,call, or complete the form to learn how Midnight Tech can
            solve your buying problems
          </p>
          <p>midnighttech@gmail.com</p>
          <p>+91 1234567890</p>
          <p className="underline font-semibold">Customer Support</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contact.map((item, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/5">
        <form
          className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-semibold">Get in Touch</h1>
          <p>You can reach us anytime</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={data?.firstName || ""}
              onChange={handleData}
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={data?.lastName || ""}
              onChange={handleData}
            />
          </div>
          <Input
            label="Email"
            type="email"
            placeholder="Your Email"
            name="email"
            value={data?.email || ""}
            onChange={handleData}
          />
          <Input
            label="Phone Number"
            type="text"
            placeholder="Phone number"
            name="phone"
            value={data?.phone || ""}
            onChange={handleData}
          />
          <Textarea
            placeholder="How can we help"
            name="message"
            value={data?.message || ""}
            onChange={handleData}
          />
          <Button color="secondary" type="submit">
            Submit
          </Button>
          <p className="text-xs text-gray-500 text-center">
            By contacting us, you agree to our
            <b> Terms of service </b>
            and
            <b> Privacy Policy </b>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
