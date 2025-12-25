"use client";
import { Heart, Home, Plus, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 w-full md:top-0 md:left-0 md:w-20 md:h-screen bg-[#0a0510]/95 md:bg-transparent border-t border-purple-900/30 md:border-none flex md:flex-col items-center justify-around md:justify-center gap-8 py-4 z-50">
      <Home
        onClick={() => {
          router.push("/");
        }}
        className="text-purple-50 cursor-pointer"
        size={26}
      />
      <Search
        onClick={() => {
          router.push("/search");
        }}
        className="text-purple-400/50 hover:text-purple-50 cursor-pointer"
        size={26}
      />
      <div className="p-2 bg-purple-900/30 rounded-lg">
        <Plus
          className="text-purple-400/50 hover:text-purple-50 cursor-pointer"
          size={26}
        />
      </div>
      <Heart
        className="text-purple-400/50 hover:text-purple-50 cursor-pointer"
        size={26}
      />
      <User
        onClick={() => {
          router.push("/profile");
        }}
        className="text-purple-400/50 hover:text-purple-50 cursor-pointer"
        size={26}
      />
    </nav>
  );
}
