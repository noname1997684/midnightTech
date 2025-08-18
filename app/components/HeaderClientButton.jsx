"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { Badge } from "@heroui/react";
import { Heart, ShoppingCart, Bookmark } from "lucide-react";
import Link from "next/link";

const HeaderClientButton = () => {
  const { user } = useAuth();
  const { data } = useUser(user?.uid);
  return (
    <div className="flex items-center gap-1">
      <Link href={"/favorites"}>
        {data?.favorites?.length !== 0 && (
          <Badge
            content={data?.favorites?.length || 0}
            variant="solid"
            size="sm"
            className="border-none text-white bg-red-500 text-[8px]"
          >
            <button
              title="My Favorites"
              className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
            >
              <Heart size={20} />
            </button>
          </Badge>
        )}
        {data?.favorites?.length === 0 && (
          <button
            title="My Favorites"
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <Heart size={20} />
          </button>
        )}
      </Link>
      <Link href={"/saved"}>
        {data?.savedPosts?.length !== 0 && (
          <Badge
            content={data?.savedPosts?.length || 0}
            variant="solid"
            size="sm"
            className="border-none text-white bg-red-500 text-[8px]"
          >
            <button
              title="My Saved Posts"
              className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
            >
              <Bookmark size={20} />
            </button>
          </Badge>
        )}
        {data?.savedPosts?.length === 0 && (
          <button
            title="My Favorites"
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <Bookmark size={20} />
          </button>
        )}
      </Link>
      <Link href={"/cart"}>
        {data?.carts?.length ? (
          <Badge
            content={data?.carts?.length || 0}
            variant="solid"
            size="sm"
            className="border-none text-white bg-red-500 text-[8px]"
          >
            <button
              title="My Cart"
              className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
            >
              <ShoppingCart size={20} />
            </button>
          </Badge>
        ) : (
          <button
            title="My Cart"
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <ShoppingCart size={20} />
          </button>
        )}
      </Link>
    </div>
  );
};

export default HeaderClientButton;
