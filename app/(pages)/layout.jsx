import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthContextProvider from "@/contexts/AuthContext";

const layout = ({ children }) => {
  return (
    <main>
      <AuthContextProvider>
        <Header />
      </AuthContextProvider>
      {children}
      <Footer />
    </main>
  );
};

export default layout;
