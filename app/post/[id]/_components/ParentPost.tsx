"use client";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { getLikeStatus, toggleLike } from "@/lib/actions/post";
import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Post } from "@/types/api/Post";

export default function MainPost({ post }: { post: Post }) {
  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [repliesCount, setRepliesCount] = useState(post.replies_count);

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
    // Thay đổi border tím thành trắng mờ
    <article className="py-4 border-b border-white/5 flex gap-3 flex-col bg-transparent">
      <div className="flex gap-3 items-center">
        <Link href={`/user/${post.author?.id}`}>
          <Avatar className="w-9 h-9 border border-white/10">
            <AvatarImage
              src={post.author?.image || "/bacon.png"}
              className="bg-zinc-800"
            />
            <AvatarFallback className="bg-zinc-800 text-white">
              {post.author?.username[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
        <h4 className="font-bold text-[15px] hover:underline cursor-pointer text-white">
          {post.author?.username}
        </h4>
      </div>

      <div className="flex flex-col gap-1 w-full min-w-0">
        <div className="flex gap-5 items-center">
          {/* Thời gian màu xám mờ */}
          <span className="text-zinc-500 text-xs">{post.time}</span>
        </div>

        {/* Nội dung text màu zinc-100 để không quá chói */}
        <p className="text-[15px] leading-relaxed text-zinc-100 wrap-break-word whitespace-pre-wrap mt-1">
          {post.content}
        </p>

        {post.media && post.media.length > 0 && (
          <div className="mt-3 w-full max-w-[480px]">
            <div
              className={`grid gap-2 ${post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
            >
              {post.media.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl border border-white/10"
                >
                  {item.type === "video" ? (
                    <video src={item.url} controls className="w-full" />
                  ) : (
                    <img
                      src={item.url}
                      alt="Thread media"
                      className={`w-full object-cover ${post.media?.length === 1 ? "max-h-[400px]" : "h-[200px]"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nhóm nút tương tác - Chuyển sang màu Zinc */}
        <div className="flex gap-6 mt-4 text-zinc-400 items-center">
          <div className="flex items-center gap-1.5 group">
            <Heart
              size={19}
              className={`cursor-pointer transition-all duration-200 ${
                isLike
                  ? "text-[#ff3040] fill-[#ff3040]"
                  : "group-hover:text-[#ff3040]"
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
            <NumberFlow
              value={likesCount}
              className="text-[13px] font-medium"
            />
          </div>

          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-white transition group"
            onClick={() => setIsReplying(!isReplying)}
          >
            <MessageCircle size={19} className="group-hover:text-blue-400" />
            <NumberFlow
              value={repliesCount}
              className="text-[13px] font-medium"
            />
          </div>

          <Repeat2
            size={19}
            className="hover:text-green-500 cursor-pointer transition"
          />
          <Send
            size={19}
            className="hover:text-white cursor-pointer transition"
          />
        </div>

        {/* Ô NHẬP COMMENT - Style hiện đại theo theme tối */}
        {isReplying && (
          <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <Avatar className="w-8 h-8 border border-white/10">
              <AvatarImage src={user?.image || "/bacon.png"} />
            </Avatar>
            <div className="flex flex-col grow gap-2 bg-white/[0.03] p-3 rounded-2xl border border-white/10">
              <textarea
                autoFocus
                placeholder={`Trả lời ${post.author?.username}...`}
                className="w-full bg-transparent border-none text-[14px] text-zinc-100 focus:ring-0 resize-none outline-none p-0 min-h-[60px] placeholder:text-zinc-600"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsReplying(false)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 px-3 py-1 transition"
                >
                  Hủy
                </button>
                <button
                  disabled={!replyContent.trim() || isSubmitting}
                  onClick={handleReply}
                  className="bg-white text-black disabled:opacity-30 px-5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
                >
                  {isSubmitting ? "Đang gửi..." : "Đăng"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
