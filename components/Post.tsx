"use client";

import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  Pencil,
  Trash2,
  Bookmark,
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
  media: { id: number; url: string; type: string }[];
}

export default function Post({ post }: { post: PostProps }) {
  const { user } = useAuth();

  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [repliesCount, setRepliesCount] = useState(post.replies_count);

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isAuthor = user?.id === post.author?.id;

  /* ================= LIKE ================= */
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return (window.location.href = "/login");

    const next = !isLike;
    setIsLike(next);
    setLikesCount((prev) => (next ? prev + 1 : prev - 1));
    await toggleLike(post.id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Lỗi xóa bài:", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editContent }),
        }
      );

      if (res.ok) {
        post.content = editContent; // update tạm UI
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Lỗi chỉnh sửa:", err);
    }
  };

  /* ================= REPLY ================= */
  const handleReply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!replyContent.trim()) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: replyContent,
        parent_id: post.id,
      }),
    });

    if (res.ok) {
      setRepliesCount((prev) => prev + 1);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  /* ================= LIKE STATUS ================= */
  useEffect(() => {
    async function fetchLikeStatus() {
      const res = await getLikeStatus(post.id);
      setIsLike(res);
    }
    fetchLikeStatus();
  }, [post.id]);

  return (
    <article className="py-4 border-b border-purple-900/20 flex gap-3 hover:bg-white/[0.02] px-4 transition">
      {/* LEFT */}
      <div className="flex flex-col items-center">
        <Link href={`/user/${post.author.id}`}>
          <Avatar className="w-10 h-10 border border-purple-900/50">
            <AvatarImage
              src={
                post.author.image ||
                "https://img.icons8.com/nolan/1200/user-default.jpg"
              }
            />
            <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="w-[2px] grow bg-purple-900/20 my-2 rounded-full" />
      </div>

      {/* RIGHT */}
      <div className="flex flex-col w-full min-w-0 gap-1">
        <div className="flex justify-between items-center">
          <Link href={`/user/${post.author.id}`}>
            <h4 className="font-bold text-[15px] text-white hover:underline">
              {post.author.username}
            </h4>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 hover:bg-purple-900/30 rounded-full text-purple-400"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={18} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-zinc-950 border-purple-900/50 text-purple-100"
            >
              {isAuthor ? (
                <>
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setEditContent(post.content);
                    }}
                  >
                    <Pencil size={14} /> Chỉnh sửa
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer text-red-400"
                    onClick={handleDelete}
                  >
                    <Trash2 size={14} /> Xóa bài
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setEditContent(post.content);
                    }}
                  >
                    <Bookmark />
                    Lưu
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* CONTENT / EDIT */}
        {isEditing ? (
          <div
            className="mt-2 border border-purple-900/40 rounded-xl p-3 bg-purple-950/30"
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent text-sm text-purple-100 resize-none outline-none min-h-[80px]"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-purple-400"
              >
                Hủy
              </button>
              <button
                onClick={handleEdit}
                disabled={!editContent.trim()}
                className="bg-purple-600 px-4 py-1 rounded-full text-xs font-bold text-white disabled:opacity-40"
              >
                Lưu
              </button>
            </div>
          </div>
        ) : (
          <Link href={`/post/${post.id}`} className="block">
            <p className="text-[15px] text-purple-50 whitespace-pre-wrap break-words mt-1">
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
                      <img
                        src={item.url}
                        alt="Thread media"
                        className={`w-full object-cover ${
                          post.media.length === 1
                            ? "max-h-[350px]" // Ảnh đơn nhỏ hơn
                            : "h-[160px] md:h-[200px]" // Ảnh grid nhỏ hơn
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Link>
        )}

        {/* ACTIONS */}
        <div className="flex gap-6 mt-3 text-purple-300/70 items-center">
          <div className="flex gap-1.5 cursor-pointer" onClick={handleLike}>
            <Heart
              size={19}
              className={
                isLike ? "text-pink-500 fill-pink-500" : "hover:text-pink-500"
              }
            />
            <NumberFlow value={likesCount} className="text-xs" />
          </div>

          <div
            className="flex gap-1.5 cursor-pointer"
            onClick={() => {
              if (!user) {
                window.location.href = "/login";
                return;
              }
              setIsReplying(!isReplying);
            }}
          >
            <MessageCircle size={19} className="hover:text-blue-300" />
            <NumberFlow value={repliesCount} className="text-xs" />
          </div>

          <Repeat2 size={19} />
          <Send size={19} />
        </div>

        {/* QUICK REPLY */}
        {isReplying && (
          <div className="mt-4 flex gap-3 border-l-2 border-purple-900/30 pl-4">
            <Avatar className="w-7 h-7">
              <AvatarImage
                src={
                  user?.image ||
                  "https://img.icons8.com/nolan/1200/user-default.jpg"
                }
              />
            </Avatar>

            <div className="flex flex-col gap-2 grow">
              <textarea
                autoFocus
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Trả lời ${post.author.username}...`}
                className="bg-transparent text-sm resize-none outline-none min-h-[40px]"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsReplying(false)}
                  className="text-xs text-purple-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="bg-purple-600 px-4 py-1 rounded-full text-xs font-bold text-white disabled:opacity-40"
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
