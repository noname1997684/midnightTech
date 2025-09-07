import React from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
const Introduction = () => {
  const introduceCard = [
    {
      title: "Define the product range",
      description:
        "We carefully select and offer the latest technology products to meet your needs, ensuring quality, innovation, and reliability.",
      icon: <InventoryIcon className="text-white " fontSize="large" />,
    },
    {
      title: "Optimize shopping experience",
      description:
        "Our store layout and website are designed for smooth navigation, making it easy for you to find and purchase the right gadgets.",
      icon: <SettingsSuggestIcon className="text-white" fontSize="large" />,
    },
    {
      title: "Enhance customer support",
      description:
        "We provide fast, friendly, and knowledgeable support to help you get the most out of your tech purchases.",
      icon: <SupportAgentIcon className="text-white" fontSize="large" />,
    },
    {
      title: "Test and ensure quality",
      description:
        "All our products go through strict quality checks to ensure you receive only the best, most reliable technology.",
      icon: (
        <PrecisionManufacturingIcon className="text-white" fontSize="large" />
      ),
    },
  ];
  return (
    <div className="container bg-[#4a3e96] min-h-screen px-8 py-14">
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex  gap-10 justify-center ">
          <div className="flex  justify-center items-center w-24 h-24">
            <img
              src="/admin.jfif"
              alt="ceo"
              className=" object-cover rounded-full w-full h-full"
            />
          </div>
          <div className="flex w-3/4  flex-col justify-center items-start text-white gap-10">
            <h1 className="text-2xl  ">
              “<b>Midnight Tech</b> has truly set the standard for excellence in
              technology retail. Their commitment to offering top-quality
              products, outstanding customer service, and innovative solutions
              makes them a trusted partner for anyone looking to embrace the
              future of technology. I am proud to witness their growth and
              impact in the tech community.”
            </h1>
            <div className="flex flex-col items-start gap-1">
              <h5 className="font-bold text-medium">Hùng Nguyễn</h5>
              <p className="text-sm ">CEO of Midnight Tech</p>
            </div>
          </div>
        </div>
        <div className="w-[86%] h-[1px] text-white bg-white"></div>
      </div>
      <h1 className="text-4xl font-semibold text-white mt-6 ml-24 w-1/3">
        They like how we structure our tech business
      </h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-10 px-6">
        {introduceCard.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-transparent p-4 text-white rounded-lg mt-6 w-[86%] mx-auto"
          >
            <div className="bg-[#4a3e96] p-3 rounded-full ">{item.icon}</div>
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-300 w-80">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Introduction;
