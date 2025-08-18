"use client";

import { useBrands } from "@/lib/firestore/brands/read";
import { useCategories } from "@/lib/firestore/categories/read";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const BasicDetails = ({
  data,
  handleData,
  setChoice,
  choicesList,
  choice,
  generateBotResponse,
  AILoading,
}) => {
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <section className=" flex flex-1 flex-col gap-3 bg-white rounded-xl p-4 border ">
      <div className="flex items-center justify-between ">
        <h1 className="font-semibold">Basic Details</h1>
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
                  Create New Product With AI
                </ModalHeader>
                <ModalBody>
                  <h1>
                    How would you like AI to support you in creating your
                    product?
                  </h1>
                  <h2 className="text-red-500 text-sm">
                    *Please make sure to enter the product name before
                    generating.
                  </h2>
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
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-title">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="Enter Title"
          id="product-title"
          value={data?.title || ""}
          onChange={(e) => handleData("title", e.target.value)}
          name="product-title"
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-short-description"
        >
          Short Description <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="Enter Short Description"
          id="product-short-description"
          value={data?.shortDescription || ""}
          onChange={(e) => handleData("shortDescription", e.target.value)}
          name="product-short-description"
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-brand">
          Brand <span className="text-red-500">*</span>
        </label>
        <select
          id="product-brand"
          value={data?.brandId || ""}
          onChange={(e) => handleData("brandId", e.target.value)}
          name="product-brand"
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value="">Select Brand</option>
          {brands?.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-category">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="product-category"
          value={data?.categoryId || ""}
          onChange={(e) => handleData("categoryId", e.target.value)}
          name="product-category"
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value="">Select Category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-stock">
          Stock <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="number"
          placeholder="Enter Stock"
          id="product-stock"
          value={data?.stock || ""}
          onChange={(e) => handleData("stock", e.target.valueAsNumber)}
          name="product-stock"
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-price">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="number"
          placeholder="Enter Price"
          id="product-price"
          value={data?.price || ""}
          onChange={(e) => handleData("price", e.target.valueAsNumber)}
          name="product-price"
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-sale-price">
          Sale Price <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="number"
          placeholder="Enter Sale Price"
          id="product-sale-price"
          value={data?.salePrice || ""}
          onChange={(e) => handleData("salePrice", e.target.valueAsNumber)}
          name="product-sale-price"
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-is-featured-product"
        >
          Is Featured Product <span className="text-red-500">*</span>
        </label>
        <select
          required
          type="number"
          placeholder="Enter Sale Price"
          id="product-is-featured-product"
          value={data?.isFeatured ? "yes" : "no"}
          onChange={(e) =>
            handleData("isFeatured", e.target.value === "yes" ? true : false)
          }
          name="product-is-featured-product"
          className="border px-4 py-2 rounded-lg w-full outline-none"
        >
          <option value={"no"}>No</option>
          <option value={"yes"}>Yes</option>
        </select>
      </div>
    </section>
  );
};

export default BasicDetails;
