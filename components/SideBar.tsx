"use client";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import {
  Heart,
  Home,
  Plus,
  Search,
  User,
  Menu,
  LogOut,
  X,
  Bookmark,
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
  const socket: Socket = useSocket(user?.id);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (post) => {
      toast.custom(
        (t) => (
          <div
            onClick={() => {
              router.push(`/post/${post.id}`);
              toast.dismiss(t);
            }}
            className=" flex items-center gap-3 bg-[#1a0b2e] border border-purple-900/50 p-4 rounded-xl shadow-2xl w-full"
          >
            <img
              src={post.author.image || "/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border border-purple-500"
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-purple-50">
                {post.author.username}
                <span className="font-normal text-purple-300">
                  Có bài viết mới
                </span>
              </p>
              <p className="text-xs text-purple-400/80 truncate max-w-[200px]">
                {post.content.length > 50
                  ? post.content.slice(0, 50) + "..."
                  : post.content}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="ml-auto text-purple-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        ),
        { duration: 10000 }
      );
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

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
        <Bookmark
          onClick={() => {
            if (user) router.push(`/saved`);
            else router.push("/login");
          }}
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
