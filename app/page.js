import {
  getFeaturedProducts,
  getProducts,
  getProductsByLikeandOrder,
} from "@/lib/firestore/products/read_server";
import Header from "./components/Header";
import FeaturedProductSlider from "./components/Slider";
import Collections from "./components/Collections";
import { getCollections } from "@/lib/firestore/collections/read_server";
import Categories from "./components/Categories";
import { getCategories } from "@/lib/firestore/categories/read_server";
import ProductsGridView from "./components/Products";
import CustomerReviews from "./components/CustomerReviews";
import Brands from "./components/Brands";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import { getBlogs } from "@/lib/firestore/blogs/read_server";
import LikeProducts from "./components/LikeProducts";

export default async function Home() {
  const [featuredProducts, collections, categories, brands, blogs, products] =
    await Promise.all([
      getFeaturedProducts(),
      getCollections(),
      getCategories(),
      getBrands(),
      getBlogs({
        pageLimit: 5,
      }),
      getProducts(),
    ]);

  return (
    <main className="w-screen h-screen overflow-x-hidden overflow-y-auto">
      <AuthContextProvider>
        <Header />
      </AuthContextProvider>
      <FeaturedProductSlider featuredProducts={featuredProducts} />
      <Collections collections={collections} />
      <AuthContextProvider>
        <LikeProducts />
      </AuthContextProvider>
      <Categories categories={categories} />
      <ProductsGridView />
      <CustomerReviews />
      <Brands brands={brands} />
      <ChatBot
        products={products}
        blogs={blogs}
        brands={brands}
        categories={categories}
        collections={collections}
      />
      <Footer />
    </main>
  );
}
