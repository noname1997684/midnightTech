"use client";

import { useEffect, useState } from "react";
import BasicDetails from "./components/BasicDetails";
import Images from "./components/Images";
import Description from "./components/Decription";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import {
  createNewProduct,
  updateProduct,
} from "@/lib/firestore/products/write";
import useGetPicture from "@/hooks/useGetPicture";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/firestore/products/read_server";
import { useRouter } from "next/navigation";

const page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState([]);
  const [AILoading, setAILoading] = useState(false);
  const choicesList = [
    {
      name: "Short Description",
      value: "short-description",
      request: "Please provide a short description for this product:",
    },
    {
      name: "Price",
      value: "price",
      request:
        "Collect the market prices in of this product and suggest the most reasonable price:",
    },
    {
      name: "Sales Price",
      value: "sales-price",
      request:
        "suggest the most reasonable sales price with this price for this product:",
    },
    {
      name: "Description",
      value: "description",
      request: "Please provide a description for this product:",
    },
  ];
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const generateBotResponse = async (selectedChoices) => {
    if (!data?.title) {
      toast.error("Please enter product name first!");
      return;
    }
    setAILoading(true);
    try {
      const responses = {};

      for (const choiceValue of selectedChoices) {
        const choiceConfig = choicesList.find(
          (item) => item.value === choiceValue
        );
        if (!choiceConfig) continue;

        if (choiceConfig.value === "sales-price" && !data.price) {
          toast.error("Please enter the product price first!");
          return;
        }
        let requestText = choiceConfig.request;
        if (choiceConfig.value === "sales-price") {
          requestText += `The original price is ${data.price}.`;
        }
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Product Name: ${data.title}\n${requestText}\nProvide only one option for this request. If ask for a price, provide only the exactly price without any additional text.`,
                  },
                ],
              },
            ],
          }),
        };

        const response = await fetch("/api/chatbot", requestOptions);
        const apiData = await response.json();

        if (apiData.error) {
          console.error(`Error for ${choiceValue}:`, apiData.error);
          responses[choiceValue] = `Error: ${apiData.error}`;
          continue;
        }

        let apiResponseText = apiData.candidates[0].content.parts[0].text
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .trim();
        apiResponseText = cleanResponse(apiResponseText, choiceValue);
        responses[choiceValue] = apiResponseText;
        switch (choiceValue) {
          case "short-description":
            handleData("shortDescription", apiResponseText);
            break;
          case "description":
            handleData("description", apiResponseText);
            break;
          case "price":
            const priceMatch = apiResponseText.match(/\$?(\d+(?:\.\d{2})?)/);
            if (priceMatch) {
              handleData("price", parseFloat(priceMatch[1]));
            }
            break;
          case "sales-price":
            const salePriceMatch =
              apiResponseText.match(/\$?(\d+(?:\.\d{2})?)/);
            if (salePriceMatch) {
              handleData("salePrice", parseFloat(salePriceMatch[1]));
            }
            break;
        }
      }

      toast.success("AI responses generated successfully!");
    } catch (error) {
      console.error("Error generating responses:", error);
      toast.error("Failed to generate AI responses");
    } finally {
      setAILoading(false);
    }
  };
  const cleanResponse = (text, choiceType) => {
    switch (choiceType) {
      case "short-description":
        return text
          .replace(/^(Short Description|Description):\s*/i, "")
          .replace(/^Here's a short description:\s*/i, "")
          .replace(/^Product Description:\s*/i, "")
          .replace(/^Brief Description:\s*/i, "")
          .trim();

      case "description":
        return text
          .replace(/^(Product Description|Description):\s*/i, "")
          .replace(/^Here's a detailed description:\s*/i, "")
          .replace(/^Full Description:\s*/i, "")
          .replace(/^Detailed Product Description:\s*/i, "")
          .trim();

      case "price":
        const priceMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
        return priceMatch ? priceMatch[1] : text;

      case "sales-price":
        const salePriceMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
        return salePriceMatch ? salePriceMatch[1] : text;

      default:
        return text;
    }
  };
  const {
    picURL: featureImage,
    setPicURL,
    handlePicChange,
    handleMultiplePicChange,
    picURLs,
    setPicURLs,
  } = useGetPicture();
  const fetchData = async () => {
    try {
      const res = await getProduct(id);
      if (!res) {
        toast.error("Product not found");
        return;
      } else {
        setData(res);
        setPicURLs(res.imagesURLs || []);
        setPicURL(res.featureImageURL || null);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  const handleCreate = async () => {
    setLoading(true);
    try {
      await createNewProduct(data, featureImage, picURLs);
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setData(null);
      setPicURLs([]);
      setPicURL(null);
    }
  };
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateProduct(data, featureImage, picURLs);
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setData(null);
      setPicURLs([]);
      setPicURL(null);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (id) {
          handleUpdate();
        } else {
          handleCreate();
        }
      }}
      className="flex flex-col gap-4 p-5"
    >
      <div className="flex items-center justify-between w-full">
        <h1 className=" font-semibold">
          {id ? "Update Product" : "Create New Product"}
        </h1>
        <Button type="submit" isLoading={loading} isDisabled={loading}>
          {id ? "Update" : "Create"}
        </Button>
      </div>
      <div className="flex gap-5 flex-col md:flex-row">
        <div className="flex flex-1">
          <BasicDetails
            data={data}
            handleData={handleData}
            setChoice={setChoice}
            choicesList={choicesList}
            choice={choice}
            generateBotResponse={generateBotResponse}
            AILoading={AILoading}
          />
        </div>
        <div className="flex flex-col gap-5 flex-1 h-full">
          <Images
            featureImage={featureImage}
            handlePicChange={handlePicChange}
            handleMultiplePicChange={handleMultiplePicChange}
            picURLs={picURLs}
          />
          <Description data={data} handleData={handleData} />
        </div>
      </div>
    </form>
  );
};

export default page;
