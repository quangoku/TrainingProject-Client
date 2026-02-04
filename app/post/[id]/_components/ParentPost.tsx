"use client";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { getLikeStatus, toggleLike } from "@/lib/actions/post";
import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

interface User {
  image: string;
  username: string;
  id: number;
}
interface Post {
  id: number;
  content: string;
  author: User;
  likes_count: number;
  replies_count: number;
  time?: string; // Thêm dấu ? vì có thể undefined
}

export default function MainPost({ post }: { post: Post }) {
  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [repliesCount, setRepliesCount] = useState(post.replies_count);

  // State quản lý việc hiện ô nhập và nội dung comment
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    async function fetchLikeStatus() {
      const res = await getLikeStatus(post.id);
      setIsLike(res);
    }
    fetchLikeStatus();
  }, [post.id]);

  const handleReply = async () => {
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          parent_id: post.id,
        }),
      });

      if (response.ok) {
        setRepliesCount((prev) => prev + 1);
        setReplyContent("");
        setIsReplying(false);
      }
    } catch (error) {
      console.error("Lỗi khi gửi comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="py-4 border-b border-purple-900/20 flex gap-3 flex-col">
      <div className="flex gap-3 items-center">
        <Link href={`/user/${post.author?.id}`}>
          <Avatar>
            <AvatarImage
              src={
                post.author?.image ||
                "https://img.icons8.com/nolan/1200/user-default.jpg"
              }
              className="bg-purple-900"
            />
            <AvatarFallback>{post.author?.username[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <h4 className="font-bold text-sm hover:underline cursor-pointer text-white">
          {post.author?.username}
        </h4>
      </div>

      <div className="flex flex-col gap-1 w-full min-w-0">
        <div className="flex gap-5 items-center">
          <span className="text-purple-400/50 text-xs">{post.time}</span>
        </div>

        <p className="text-[15px] leading-relaxed text-purple-100 wrap-break-word whitespace-pre-wrap">
          {post.content}
        </p>

        {post.media && post.media.length > 0 && (
          <div className="mt-3 w-full max-w-[450px]">
            {" "}
            {/* Giới hạn chiều rộng cụm ảnh nhỏ hơn */}
            <div
              className={`grid gap-3 ${
                post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {post.media.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg border border-[#333]"
                >
                  {item.type === "video" ? (
                    <video src={item.url} controls autoPlay></video>
                  ) : (
                    <img
                      src={item.url}
                      alt="Thread media"
                      className={`w-full object-cover ${
                        post.media.length === 1
                          ? "max-h-[350px]" // Ảnh đơn nhỏ hơn
                          : "h-[160px] md:h-[200px]" // Ảnh grid nhỏ hơn
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nhóm nút tương tác */}
        <div className="flex gap-6 mt-3 text-purple-300 items-center">
          <div className="flex items-center gap-1.5">
            <Heart
              size={20}
              className={`cursor-pointer transition-all duration-300 ${
                isLike ? "text-pink-500 fill-pink-500" : "hover:text-pink-500"
              }`}
              onClick={async (e) => {
                e.stopPropagation();
                if (!user) return (window.location.href = "/login");
                const newLikeStatus = !isLike;
                setIsLike(newLikeStatus);
                setLikesCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));
                await toggleLike(post.id);
              }}
            />
            <NumberFlow value={likesCount} className="text-sm" />
          </div>

          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-purple-400 transition"
            onClick={() => setIsReplying(!isReplying)}
          >
            <MessageCircle size={20} />
            <NumberFlow value={repliesCount} className="text-sm" />
          </div>

          <Repeat2
            size={20}
            className="hover:text-green-400 cursor-pointer transition"
          />
          <Send
            size={20}
            className="hover:text-blue-400 cursor-pointer transition"
          />
        </div>

        {/* Ô NHẬP COMMENT - Hiện ra khi isReplying === true */}
        {isReplying && (
          <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  user?.image ||
                  "https://img.icons8.com/nolan/1200/user-default.jpg"
                }
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col grow gap-2 bg-purple-900/10 p-3 rounded-2xl border border-purple-900/20">
              <textarea
                autoFocus
                placeholder={`Trả lời ${post.author?.username}...`}
                className="w-full bg-transparent border-none text-sm text-purple-100 focus:ring-0 resize-none outline-none p-0 min-h-[60px]"
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
                  disabled={!replyContent.trim() || isSubmitting}
                  onClick={handleReply}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-1 rounded-full text-xs font-bold transition shadow-lg"
                >
                  {isSubmitting ? "Đang gửi..." : "Đăng"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-purple-900/10 mt-6"></div>
      </div>
    </article>
  );
}
