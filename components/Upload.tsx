"use client";
import { useState } from "react"; // Thêm useState
import { useAuth } from "@/Context/AuthContext";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog từ shadcn
import { DialogDescription } from "@radix-ui/react-dialog";

export default function Upload() {
  const { user } = useAuth();
  const [content, setContent] = useState(""); // Lưu nội dung bài đăng
  const [open, setOpen] = useState(false); // Kiểm soát đóng/mở modal

  if (!user) return null;
  const handlePost = async () => {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    const result = await response.json();
    console.log(result);
    setContent("");
    setOpen(false);
  };

  return (
    <div className="hidden md:flex items-center gap-3 py-4 border-b border-purple-900/30">
      <div className="w-10 h-10 rounded-full bg-purple-800 shrink-0 overflow-hidden">
        <img
          src={user.image}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* Trigger là phần thanh input giả */}
        <DialogTrigger asChild>
          <div className="flex-1 cursor-pointer">
            <p className="text-purple-400/50 text-sm">Có gì mới?</p>
          </div>
        </DialogTrigger>
        <DialogDescription></DialogDescription>
        <DialogContent className="sm:max-w-[500px] bg-[#120a1c] border-purple-900/50 text-purple-50">
          <DialogHeader>
            <DialogTitle className="text-center border-b border-purple-900/30 pb-4">
              Nội dung
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-3 pt-4">
            <div className="w-10 h-10 rounded-full bg-purple-800 shrink-0">
              <img src={user.image} alt="" className="rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-sm font-semibold">{user.username}</p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Có gì mới?"
                className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none min-h-[120px] outline-none placeholder:text-purple-400/30"
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handlePost}
              disabled={!content.trim()}
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-6"
            >
              Đăng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={() => setOpen(true)}
        className="ml-auto px-4 py-1.5 bg-purple-600 text-sm font-semibold hover:bg-purple-500 transition cursor-pointer rounded-xl"
      >
        Đăng
      </Button>
    </div>
  );
}
