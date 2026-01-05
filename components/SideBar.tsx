"use client";
import { useAuth } from "@/context/AuthContext";
import { Heart, Home, Plus, Search, User, Menu, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SideBar() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      router.push("/login");
      setUser(null);
    } else {
      console.log("Logout failed");
    }
  };

  return (
    <nav className="fixed bottom-0 w-full md:top-0 md:left-0 md:w-20 md:h-screen bg-[#0a0510]/95 md:bg-[#0a0510] border-t border-purple-900/30 md:border-r border-purple-900/20 flex md:flex-col items-center justify-between py-4 px-6 md:px-0 z-50">
      {/* Spacer cho Desktop để đẩy các icon chính vào giữa */}
      <div className="hidden md:block h-10" />

      {/* Nhóm Icons chính: Luôn ở giữa */}
      <div className="flex md:flex-col items-center justify-center gap-8 flex-1">
        <Home
          onClick={() => router.push("/")}
          className="text-purple-50 cursor-pointer hover:scale-110 transition-transform"
          size={26}
        />
        <Search
          onClick={() => router.push("/search")}
          className="text-purple-400/50 hover:text-purple-50 cursor-pointer hover:scale-110 transition-transform"
          size={26}
        />
        <div className="p-2 bg-purple-900/30 rounded-lg">
          <Plus
            className="text-purple-400/50 hover:text-purple-50 cursor-pointer"
            size={26}
          />
        </div>
        <Heart
          className="text-purple-400/50 hover:text-purple-50 cursor-pointer hover:scale-110 transition-transform"
          size={26}
        />
        <User
          onClick={() => {
            if (user) router.push(`/user/${user.id}`);
            else router.push("/login");
          }}
          className="text-purple-400/50 hover:text-purple-50 cursor-pointer hover:scale-110 transition-transform"
          size={26}
        />
      </div>

      {/* Nút Hamburger & Menu Đăng xuất: Nằm cuối */}
      {user && (
        <div className="relative md:mb-4">
          <button
            onClick={toggleMenu}
            className="text-purple-400/50 hover:text-purple-50 transition-colors p-2 flex items-center justify-center"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Pop-up Đăng xuất */}
          {isOpen && (
            <div className="absolute bottom-16 right-0 md:bottom-0 md:left-14 bg-[#1a0b2e] border border-purple-900/50 rounded-xl p-1.5 shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 min-w-[140px]">
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer w-full gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all group"
              >
                <LogOut
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
                <span className="font-semibold text-sm ">Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
