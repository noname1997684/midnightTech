import React from "react";
import Hero from "./components/Hero";
import Introduction from "./components/Introduction";
import NumberSection from "./components/NumberSection";
import Employees from "./components/Employees";
import EmailSection from "./components/EmailSection";

const page = () => {
  return (
    <main>
      <Hero />
      <Introduction />
      <NumberSection />
      <Employees />
      <EmailSection />
    </main>
  );
};

export default page;
