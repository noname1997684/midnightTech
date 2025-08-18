"use client";
import { useAuth } from "@/contexts/AuthContext";
import useGetPicture from "@/hooks/useGetPicture";
import { checkSlugExists } from "@/lib/firestore/blogs/read";
import { getBlog } from "@/lib/firestore/blogs/read_server";
import { createNewBlog, updateBlog } from "@/lib/firestore/blogs/write";
import { useUser } from "@/lib/firestore/user/read";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SmartToyIcon from "@mui/icons-material/SmartToy";
const page = () => {
  const { user } = useAuth();
  const { data: userData } = useUser(user?.uid);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState(null);
  const [value, setValue] = useState("");
  const FeaturedImageRef = useRef(null);
  const BlogImageRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [AIInput, setAIInput] = useState("");
  const [AILoading, setAILoading] = useState(false);
  const [choice, setChoice] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    picURL: featureImage,
    cloudinaryURL,
    setCloudinaryURL,
    setPicURL,
    handlePicChange,
    handleCloudinaryChange,
  } = useGetPicture();
  const handleData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  const fetchData = async () => {
    try {
      const res = await getBlog(id);
      if (!res) {
        toast.error("Blog not found");
        return;
      } else {
        setData(res);
        setValue(res.content || "");
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
  const handleCreate = async () => {
    setLoading(true);
    try {
      let generatedSlug = data.title
        .toLowerCase()
        .replace(/ /g, "-")
        .slice(0, 35);
      let slug = generatedSlug;
      let count = 1;

      while (await checkSlugExists(slug)) {
        slug = `${generatedSlug}-${count}`;
        count++;
      }
      const blogData = {
        ...data,
        slug: slug,
        category: data.category || "technology",
        content: value,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        uid: user.uid,
      };
      await createNewBlog(blogData, featureImage);
      toast.success("Blog created successfully");
      router.push("/admin/blogs");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setData(null);
      setPicURL(null);
      setCloudinaryURL(null);
      setLoading(false);
    }
  };
  useEffect(() => {
    cloudinaryURL &&
      setValue((prev) => prev + `<p><image src="${cloudinaryURL}"/></p>`);
  }, [cloudinaryURL]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let generatedSlug = data.title
        .toLowerCase()
        .replace(/ /g, "-")
        .slice(0, 35);
      let slug = generatedSlug;
      const blogData = {
        ...data,
        category: data.category || "technology",
        slug: slug,
        content: value,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        uid: user.uid,
      };
      await updateBlog(blogData, featureImage);
      toast.success("Blog updated successfully");
      router.push("/admin/blogs");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setData(null);
      setPicURL(null);
    }
  };
  const choicesList = [
    {
      name: "Title",
      value: "title",
      request: "Please provide a title for this blog:",
    },
    {
      name: "Short Description",
      value: "short-description",
      request: "Please provide a short description for this blog:",
    },
    {
      name: "Blog Body",
      value: "description",
      request: "Please provide a article body for this article:",
    },
  ];
  const generateBotResponse = async () => {
    setAILoading(true);
    try {
      const responses = {};

      // Process each choice sequentially
      for (const choiceValue of choice) {
        const choiceConfig = choicesList.find(
          (item) => item.value === choiceValue
        );
        if (!choiceConfig) continue;
        let requestText = choiceConfig.request;

        // Customize request for blog body to get article-like content
        if (choiceValue === "description") {
          requestText = `Write a complete blog article about: ${AIInput}
        
        Please write in a professional blog style with:
        - Introduction paragraph
        - Multiple detailed sections with subheadings
        - Conclusion
        - Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <li> tags
        - Make it informative and engaging
        - Length should be 800-1200 words
        
        Topic: ${AIInput}`;
        } else {
          requestText = `${choiceConfig.request} Topic: ${AIInput}`;
        }

        // Create history for this specific request

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
                    text: `${requestText} \nProvide only one option for this request.`,
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
        console.log(`Response for ${choiceValue}:`, apiResponseText);
        apiResponseText = cleanResponse(apiResponseText, choiceValue);
        responses[choiceValue] = apiResponseText;
        switch (choiceValue) {
          case "title":
            handleData("title", apiResponseText);
            break;
          case "short-description":
            handleData("shortDescription", apiResponseText);
            break;
          case "description":
            setValue(apiResponseText);
            break;
        }
      }

      // Update response state with all results
      console.log("All responses:", responses);
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
      case "title":
        // Remove common prefixes for titles
        return text
          .replace(/^(Title|Blog Title):\s*/i, "")
          .replace(/^Here's a title:\s*/i, "")
          .replace(/^Blog Title:\s*/i, "")
          .replace(/^Suggested Title:\s*/i, "")
          .replace(/^Proposed Title:\s*/i, "")
          .replace(/^Option:\s*/i, "")
          .trim();
      case "short-description":
        // Remove common prefixes for short descriptions
        return text
          .replace(/^(Short Description|Description):\s*/i, "")
          .replace(/^Here's a short description:\s*/i, "")
          .replace(/^Product Description:\s*/i, "")
          .replace(/^Brief Description:\s*/i, "")
          .trim();

      case "description":
        // Remove common prefixes for descriptions
        return text
          .replace(/^(Product Description|Description):\s*/i, "")
          .replace(/^Here's a detailed description:\s*/i, "")
          .replace(/^Full Description:\s*/i, "")
          .replace(/^Detailed Product Description:\s*/i, "")
          .replace(/^```html\s*/i, "") // Remove opening ```html
          .replace(/```\s*$/i, "") // Remove closing ```
          .replace(/^```\s*/i, "") // Remove any other opening ```
          .replace(/```$/i, "") // Remove any other closing ```
          .trim();
      default:
        return text;
    }
  };
  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6 p-5 overflow-y-scroll">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Create a New Post</h1>
        <Button
          isIconOnly
          radius="full"
          variant="ghost"
          onPress={onOpen}
          isLoading={AILoading}
          isDisabled={AILoading}
        >
          <SmartToyIcon color="secondary" />
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center">
                  Create New Blog With AI
                </ModalHeader>
                <ModalBody>
                  <h1>
                    How would you like AI to support you in creating your blog?
                  </h1>
                  <h1>Let we hear your thoughts</h1>
                  <Input
                    label="Your Thoughts"
                    value={AIInput}
                    onChange={(e) => setAIInput(e.target.value)}
                  />
                  <CheckboxGroup
                    value={choice}
                    onChange={(value) => {
                      setChoice(value);
                    }}
                    label="Select Fields"
                  >
                    {choicesList.map((item) => (
                      <Checkbox key={item.value} value={item.value}>
                        {item.name}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() => {
                      generateBotResponse(choice);
                      onClose();
                    }}
                  >
                    Generate
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <form
        action=""
        className="flex flex-col gap-6 flex-1 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
      >
        <button
          type="button"
          onClick={() => FeaturedImageRef.current.click()}
          className="p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white w-max"
        >
          Add a cover image
        </button>
        <input
          type="file"
          id="blog-feature-image"
          onChange={handlePicChange}
          name="blog-feature-image"
          className="hidden"
          ref={FeaturedImageRef}
        />
        {featureImage && (
          <div className="flex items-center justify-start">
            <img
              src={featureImage}
              className="h-32 object-cover"
              alt="featured-picture"
            />
          </div>
        )}
        <input
          type="text"
          placeholder="My Awesome Story"
          className="text-4xl font-semibold bg-transparent outline-none"
          name="title"
          value={data?.title || ""}
          onChange={(e) => handleData("title", e.target.value)}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label htmlFor="" className="text-sm">
              Choose a category:
            </label>
            <select
              value={data?.category || "techology"}
              onChange={(e) => handleData("category", e.target.value)}
              className="p-2 rounded-xl bg-white shadow-md"
            >
              <option value="technology">Technology</option>
              <option value="game">Game</option>
              <option value="coding">Coding</option>
              <option value="product">Product</option>
              <option value="guide">Guide</option>
              <option value="review">Review</option>
            </select>
          </div>
          <div className="flex  gap-3 items-center">
            <label
              className="text-sm w-64"
              htmlFor="product-is-featured-product"
            >
              Is Featured Blog<span className="text-red-500">*</span>
            </label>
            <select
              required
              type="number"
              placeholder="Enter Sale Price"
              id="blog-is-featured-product"
              value={data?.isFeatured ? "yes" : "no"}
              onChange={(e) =>
                handleData(
                  "isFeatured",
                  e.target.value === "yes" ? true : false
                )
              }
              name="blog-is-featured-"
              className="border px-4 py-2 rounded-lg w-full outline-none shadow-md"
            >
              <option value={"no"}>No</option>
              <option value={"yes"}>Yes</option>
            </select>
          </div>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white shadow-md"
          name="desc"
          placeholder="A Short Description"
          value={data?.shortDescription || ""}
          onChange={(e) => handleData("shortDescription", e.target.value)}
        />
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 mr-2">
            <div
              className="cursor-pointer"
              onClick={() => BlogImageRef.current.click()}
            >
              🖼
            </div>
            <input
              type="file"
              id="blog-image"
              onChange={handleCloudinaryChange}
              name="blog-image"
              className="hidden"
              ref={BlogImageRef}
            />
            <div className="cursor-pointer">🎞</div>
          </div>
          <ReactQuill
            value={value}
            onChange={setValue}
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
          />
        </div>
        <Button
          isLoading={loading}
          isDisabled={loading}
          type="submit"
          className="disabled:bg-blue-400 disabled:cursor-not-allowed bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36"
        >
          {id ? "Update Post" : "Create Post"}
        </Button>
      </form>
    </div>
  );
};

export default page;
