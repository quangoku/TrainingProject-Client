"use client";

import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { getLikeStatus, toggleLike } from "@/lib/actions/post";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import NumberFlow from "@number-flow/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  image: string;
  username: string;
  id: number;
}

interface PostProps {
  id: number;
  content: string;
  author: User;
  likes_count: number;
  replies_count: number;
}

export default function Post({ post }: { post: PostProps }) {
  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [repliesCount, setRepliesCount] = useState(post.replies_count);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { user } = useAuth();

  const isAuthor = user?.id === post.author?.id;

  // Xử lý Like
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return (window.location.href = "/login");

    const newLikeStatus = !isLike;
    setIsLike(newLikeStatus);
    setLikesCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));
    await toggleLike(post.id);
  };

  // Xử lý Xóa bài (Sử dụng cấu hình CASCADE từ NestJS của bạn)
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa bài viết này và tất cả phản hồi của nó?"
      )
    )
      return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        // Có thể thay bằng logic state để xóa bài khỏi danh sách mà không reload
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài:", error);
    }
  };

  // Xử lý Trả lời
  const handleReply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!replyContent.trim()) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, parent_id: post.id }),
    });

    if (response.ok) {
      setRepliesCount((prev) => prev + 1);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  useEffect(() => {
    async function fetchLikeStatus() {
      const res = await getLikeStatus(post.id);
      setIsLike(res);
    }
    fetchLikeStatus();
  }, [post.id]);

  return (
    <article className="py-4 border-b border-purple-900/20 flex gap-3 relative hover:bg-white/[0.02] transition-colors px-4">
      {/* Cột trái: Avatar và đường kẻ nối */}
      <div className="flex flex-col items-center">
        <Link
          href={`/user/${post.author?.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="w-10 h-10 border border-purple-900/50">
            <AvatarImage
              src={
                post.author?.image ||
                "https://img.icons8.com/nolan/1200/user-default.jpg"
              }
              className="object-cover"
            />
            <AvatarFallback>{post.author?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="w-[2px] grow bg-purple-900/20 my-2 rounded-full"></div>
      </div>

      {/* Cột phải: Nội dung chính */}
      <div className="flex flex-col gap-1 w-full min-w-0">
        <div className="flex justify-between items-center">
          <Link href={`/user/${post.author?.id}`} className="z-10">
            <h4 className="font-bold text-[15px] hover:underline cursor-pointer text-white">
              {post.author?.username}
            </h4>
          </Link>

          {/* Menu chức năng (Edit/Delete) */}
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 hover:bg-purple-900/30 rounded-full transition text-purple-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-950 border-purple-900/50 text-purple-100"
              >
                <DropdownMenuItem
                  className="flex gap-2 cursor-pointer focus:bg-purple-900/50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Edit click"); // Thêm modal edit ở đây
                  }}
                >
                  <Pencil size={14} /> Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex gap-2 cursor-pointer text-red-400 focus:bg-red-950/30 focus:text-red-400 font-medium"
                  onClick={handleDelete}
                >
                  <Trash2 size={14} /> Xóa bài
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Nội dung bài viết dẫn link vào chi tiết */}
        <Link href={`/post/${post.id}`} className="group">
          <p className="text-[15px] leading-relaxed text-purple-50 whitespace-pre-wrap break-words mt-0.5">
            {post.content}
          </p>
        </Link>

        {/* Các nút tương tác */}
        <div className="flex gap-6 mt-3 text-purple-300/70 items-center">
          <div
            className="flex items-center gap-1.5 group cursor-pointer"
            onClick={handleLike}
          >
            <Heart
              size={19}
              className={`transition-all duration-300 ${
                isLike
                  ? "text-pink-500 fill-pink-500"
                  : "group-hover:text-pink-500"
              }`}
            />
            <NumberFlow value={likesCount} className="text-xs font-medium" />
          </div>

          <div
            className="flex items-center gap-1.5 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsReplying(!isReplying);
            }}
          >
            <MessageCircle size={19} className="group-hover:text-purple-400" />
            <NumberFlow value={repliesCount} className="text-xs font-medium" />
          </div>

          <Repeat2
            size={19}
            className="hover:text-green-500 cursor-pointer transition-colors"
          />
          <Send
            size={19}
            className="hover:text-blue-400 cursor-pointer transition-colors"
          />
        </div>

        {/* Input trả lời nhanh */}
        {isReplying && (
          <div
            className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200 border-l-2 border-purple-900/30 pl-4 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="w-7 h-7">
              <AvatarImage
                src={
                  user?.image ||
                  "https://img.icons8.com/nolan/1200/user-default.jpg"
                }
              />
            </Avatar>
            <div className="flex flex-col grow gap-2">
              <textarea
                autoFocus
                placeholder={`Trả lời ${post.author.username}...`}
                className="w-full bg-transparent border-none text-sm text-purple-100 focus:ring-0 resize-none outline-none p-0 min-h-[40px]"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsReplying(false)}
                  className="text-xs text-purple-400 hover:text-purple-200 px-3 py-1"
                >
                  Hủy
                </button>
                <button
                  disabled={!replyContent.trim()}
                  onClick={handleReply}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white px-4 py-1 rounded-full text-xs font-bold transition"
                >
                  Đăng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
