"use client";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { Post } from "@/types/api/Post";
import {
  Home,
  Plus,
  Search,
  User,
  Menu,
  LogOut,
  X,
  Bookmark,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

export default function SideBar() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const socket: Socket | null = useSocket(user?.id);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (post: Post) => {
      toast.custom(
        (t) => (
          // TOAST: Sử dụng tone màu tối của trang login, border tinh tế hơn
          <div
            onClick={() => {
              router.push(`/post/${post.id}`);
              toast.dismiss(t);
            }}
            className="flex items-center gap-3 bg-[#1a1b23] border border-gray-800 p-4 rounded-2xl shadow-2xl w-full cursor-pointer hover:border-purple-500/50 transition-colors"
          >
            <img
              src={post.author.image || "/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
            />
            <div className="flex flex-col">
              <p className="text-sm font-bold text-white">
                {post.author.username}
                <span className="font-normal text-gray-400 ml-1">
                  vừa đăng bài mới
                </span>
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                {post.content.length > 50
                  ? post.content.slice(0, 50) + "..."
                  : post.content}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t);
              }}
              className="ml-auto text-gray-600 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        ),
        { duration: 10000 },
      );
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, router]);

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
    // NAVBAR: Sử dụng màu nền #111217 đồng bộ với Login
    <nav className="fixed bottom-0 w-full md:top-0 md:left-0 md:w-20 md:h-screen bg-[#111217] border-t border-gray-800 md:border-r md:border-t-0 flex md:flex-col items-center justify-between py-4 px-6 md:px-0 z-50 shadow-2xl">
      {/* LOGO AREA (Chỉ hiện trên Desktop) */}
      <div className="hidden md:flex h-20 items-center justify-center">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center rotate-6 shadow-lg shadow-purple-500/10">
          <img src="/meblox.png" alt="Logo" className="w-8 h-8 rounded-lg" />
        </div>
      </div>

      {/* Nhóm Icons chính */}
      <div className="flex md:flex-col items-center justify-center gap-7 md:gap-9 flex-1">
        <Home
          onClick={() => router.push("/")}
          className="text-gray-400 cursor-pointer hover:text-white hover:scale-110 transition-all"
          size={24}
        />
        <Search
          onClick={() => router.push("/search")}
          className="text-gray-400 cursor-pointer hover:text-white hover:scale-110 transition-all"
          size={24}
        />

        {/* Nút Plus nổi bật */}
        <div className="p-2.5 bg-gray-800/50 hover:bg-purple-600/20 rounded-xl transition-colors group">
          <Plus
            className="text-gray-400 group-hover:text-purple-400 cursor-pointer"
            size={24}
          />
        </div>

        <Bookmark
          onClick={() => (user ? router.push(`/saved`) : router.push("/login"))}
          className="text-gray-400 cursor-pointer hover:text-white hover:scale-110 transition-all"
          size={24}
        />
        <Bell
          onClick={() =>
            user ? router.push(`/notification`) : router.push("/login")
          }
          className="text-gray-400 cursor-pointer hover:text-white hover:scale-110 transition-all"
          size={24}
        />
        <User
          onClick={() =>
            user ? router.push(`/user/${user.id}`) : router.push("/login")
          }
          className="text-gray-400 cursor-pointer hover:text-white hover:scale-110 transition-all"
          size={24}
        />
      </div>

      {/* Nút Hamburger & Menu Đăng xuất */}
      {user && (
        <div className="relative md:mb-8">
          <button
            onClick={toggleMenu}
            className={`transition-all p-2 flex items-center justify-center rounded-xl ${isOpen ? "bg-gray-800 text-white" : "text-gray-500 hover:text-white"}`}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Pop-up Đăng xuất: Style giống LoginForm */}
          {isOpen && (
            <div className="absolute bottom-20 right-0 md:bottom-0 md:left-16 bg-[#1a1b23] border border-gray-800 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200 min-w-[160px]">
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer w-full gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
              >
                <LogOut
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
                <span className="font-bold text-sm">Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
