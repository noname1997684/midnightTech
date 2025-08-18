"use client";
import React, { useState } from "react";
import ProductsGridList from "./components/ProductsGridList";
import TabBar from "./components/TabBar";
import {
  Accordion,
  AccordionItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  Slider,
} from "@heroui/react";

import { ChevronDown, FilterIcon } from "lucide-react";
import { useCategories } from "@/lib/firestore/categories/read";
import { useBrands } from "@/lib/firestore/brands/read";

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
  { name: "Date: Newest First", value: "date-desc" },
  { name: "Date: Oldest First", value: "date-asc" },
  { name: "Alphabetical: A-Z", value: "name-asc" },
  { name: "Alphabetical: Z-A", value: "name-desc" },
];

const PRICE_FILTERS = {
  id: "price",
  name: "Price",
  options: [
    { label: "All", value: [0, Infinity] },
    { label: "Under $25", value: [0, 25] },
    { label: "$25 to $50", value: [25, 50] },
    { label: "$50 to $100", value: [50, 100] },
    { label: "Over $100", value: [100, Infinity] },
  ],
};

const DEFAULT_CUSTOM_PRICE = [0, 10000];

const page = () => {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const [filter, setFilter] = useState({
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    sort: "none",
    categories: [],
    brands: [],
  });
  const selectCategoryList = categories?.map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const selectBrandList = brands?.map((brand) => ({
    label: brand.name,
    value: brand.id,
  }));
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8 relative">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Products
        </h1>
        <div className="flex items-center">
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Sort
                <ChevronDown className="mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" variant="faded">
              {SORT_OPTIONS.map((option) => (
                <DropdownItem
                  key={option.value}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, sort: option.value }))
                  }
                  className={`
                    ${filter.sort === option.value ? "bg-gray-100" : ""}
                    text-sm text-gray-700 hover:bg-gray-200`}
                >
                  {option.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <FilterIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <section className="pb-24 flex">
        <div className="hidden lg:flex sticky top-20  w-1/3 flex-col gap-4 border-r pr-4">
          <div className="flex flex-col gap-4 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Category</h3>
            <Select
              items={selectCategoryList}
              placeholder="Select a category"
              selectionMode="multiple"
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  categories: e.target.value
                    .split(",")
                    .filter((v) => v && v.trim() !== ""),
                }))
              }
            >
              {selectCategoryList?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Brands</h3>
            <Select
              items={selectBrandList}
              placeholder="Select a brand"
              selectionMode="multiple"
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  brands: e.target.value
                    .split(",")
                    .filter((v) => v && v.trim() !== ""),
                }))
              }
            >
              {selectBrandList?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Accordion selectionMode="multiple">
            <AccordionItem key="1" aria-label="price range" title="Price Range">
              <ul className="space-y-4">
                {PRICE_FILTERS.options.map((option, index) => (
                  <li key={option.label} className="flex items-center ">
                    <input
                      type="radio"
                      id={`price-${index}`}
                      defaultChecked={index === 0}
                      onChange={() => {
                        setFilter((prev) => ({
                          ...prev,
                          price: {
                            isCustom: false,
                            range: [...option.value],
                          },
                        }));
                      }}
                      checked={
                        !filter.price.isCustom &&
                        filter.price.range[0] === option.value[0] &&
                        filter.price.range[1] === option.value[1]
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`price-${index}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {option.label}
                    </label>
                  </li>
                ))}
                <li className="flex justify-center flex-col gap-2">
                  <div>
                    <input
                      type="radio"
                      id={`price-${PRICE_FILTERS.options.length}`}
                      onChange={() => {
                        setFilter((prev) => ({
                          ...prev,
                          price: {
                            isCustom: true,
                            range: [0, 100],
                          },
                        }));
                      }}
                      checked={filter.price.isCustom}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`price-${PRICE_FILTERS.options.length}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      Custom Price Range
                    </label>
                  </div>
                  <Slider
                    isDisabled={!filter.price.isCustom}
                    defaultValue={DEFAULT_CUSTOM_PRICE}
                    maxValue={DEFAULT_CUSTOM_PRICE[1]}
                    minValue={DEFAULT_CUSTOM_PRICE[0]}
                    onChange={(value) => {
                      setFilter((prev) => ({
                        ...prev,
                        price: {
                          isCustom: true,
                          range: value,
                        },
                      }));
                    }}
                    value={filter.price.range}
                    step={5}
                    formatOptions={{ style: "currency", currency: "USD" }}
                    label="Price"
                  />
                </li>
              </ul>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col mt-4 w-2/3 items-center justify-start">
          <h1 className="text-lg font-semibold">Products</h1>
          <ProductsGridList filter={filter} />
        </div>
      </section>
    </main>
  );
};

export default page;
