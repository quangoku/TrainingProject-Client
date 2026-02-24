"use client";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Bookmark,
  CircleAlert,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { toggleLike, toggleSave } from "@/lib/actions/post";
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
import { Post } from "@/types/api/Post";

export default function PostComponent({ post }: { post: Post }) {
  const { user } = useAuth();

  const [isLike, setIsLike] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [repliesCount, setRepliesCount] = useState(post.replies_count);

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isAuthor = user?.id === post.author?.id;

  /* ================= LOGIC GIỮ NGUYÊN ================= */
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return (window.location.href = "/login");
    const next = !isLike;
    setIsLike(next);
    setLikesCount((prev) => (next ? prev + 1 : prev - 1));
    await toggleLike(post.id);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return (window.location.href = "/login");
    const next = !isSaved;
    setIsSaved(next);
    await toggleSave(post.id);
  };

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
        },
      );
      if (res.ok) window.location.reload();
    } catch (err) {
      console.error("Lỗi xóa bài:", err);
    }
  };

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
        },
      );
      if (res.ok) {
        post.content = editContent;
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Lỗi chỉnh sửa:", err);
    }
  };

  const handleReply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!replyContent.trim()) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, parent_id: post.id }),
    });
    if (res.ok) {
      setRepliesCount((prev) => prev + 1);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  useEffect(() => {
    async function fetchStatus() {
      setIsLike(post.likes[0]?.is_like);
      setIsSaved(post.savedPosts[0]?.is_saved);
    }
    fetchStatus();
  }, []);

  return (
    // ARTICLE: Chuyển border-purple thành border-gray-800, hover nhẹ nhàng hơn
    <article className="py-5 border-b border-gray-800/50 flex gap-4 hover:bg-white/[0.01] px-4 transition-all duration-300">
      {/* LEFT: Avatar & Line */}
      <div className="flex flex-col items-center">
        <Link href={`/user/${post.author.id}`}>
          <Avatar className="w-10 h-10 border border-gray-800 shadow-sm transition-transform hover:scale-105">
            <AvatarImage src={post.author.image || "/bacon.png"} />
            <AvatarFallback className="bg-gray-800 text-xs text-gray-400">
              {post.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="w-[1px] grow bg-gray-800/60 my-2 rounded-full" />
      </div>

      {/* RIGHT */}
      <div className="flex flex-col w-full min-w-0 gap-1.5">
        <div className="flex justify-between items-center">
          <Link href={`/user/${post.author.id}`} className="group">
            <h4 className="font-bold text-[15px] text-white group-hover:underline decoration-gray-500 underline-offset-2">
              {post.author.username}
            </h4>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-gray-800 rounded-full text-gray-500 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#1a1b23] border-gray-800 text-gray-200 rounded-xl shadow-2xl p-1"
            >
              {isAuthor ? (
                <>
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer focus:bg-gray-800 rounded-lg py-2"
                    onClick={() => {
                      setIsEditing(true);
                      setEditContent(post.content);
                    }}
                  >
                    <Pencil size={14} />{" "}
                    <span className="text-sm font-medium">Chỉnh sửa</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer focus:bg-red-500/10 text-red-400 rounded-lg py-2"
                    onClick={handleDelete}
                  >
                    <Trash2 size={14} />{" "}
                    <span className="text-sm font-medium">Xóa bài</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="flex gap-2 cursor-pointer focus:bg-red-500/10 text-red-400 rounded-lg py-2">
                  <CircleAlert size={14} />{" "}
                  <span className="text-sm font-medium">Báo cáo</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* CONTENT / EDIT AREA */}
        {isEditing ? (
          <div className="mt-2 border border-gray-700 rounded-2xl p-4 bg-[#1a1b23]">
            <textarea
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent text-[15px] text-white resize-none outline-none min-h-[100px]"
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleEdit}
                disabled={!editContent.trim()}
                className="bg-white text-black px-5 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 disabled:opacity-50 transition-all"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        ) : (
          <Link href={`/post/${post.id}`} className="block group/content">
            <p className="text-[15px] text-gray-200 leading-relaxed whitespace-pre-wrap break-words mt-0.5">
              {post.content}
            </p>

            {post.media && post.media.length > 0 && (
              <div className="mt-3 w-full max-w-[500px]">
                <div
                  className={`grid gap-2 ${post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                >
                  {post.media.map((item) => (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-xl border border-gray-800 bg-black/20 shadow-sm"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          controls
                          className="w-full max-h-[400px]"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt="Post media"
                          className={`w-full object-cover transition-transform duration-500 group-hover/content:scale-[1.02] ${
                            post.media?.length === 1
                              ? "max-h-[450px]"
                              : "h-[180px] md:h-[240px]"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Link>
        )}

        {/* ACTIONS: Thay đổi màu sắc tinh tế hơn */}
        <div className="flex gap-7 mt-4 text-gray-500 items-center">
          <button
            className="flex items-center gap-1.5 group/btn"
            onClick={handleLike}
          >
            <div
              className={`p-2 rounded-full transition-colors group-hover/btn:bg-pink-500/10 ${isLike ? "text-pink-500" : "group-hover/btn:text-pink-500"}`}
            >
              <Heart size={19} className={isLike ? "fill-pink-500" : ""} />
            </div>
            <NumberFlow value={likesCount} className="text-xs font-medium" />
          </button>

          <button
            className="flex items-center gap-1.5 group/btn"
            onClick={() =>
              user
                ? setIsReplying(!isReplying)
                : (window.location.href = "/login")
            }
          >
            <div className="p-2 rounded-full transition-colors group-hover/btn:bg-blue-500/10 group-hover/btn:text-blue-500">
              <MessageCircle size={19} />
            </div>
            <NumberFlow value={repliesCount} className="text-xs font-medium" />
          </button>

          <button className="flex items-center group/btn" onClick={handleSave}>
            <div
              className={`p-2 rounded-full transition-colors group-hover/btn:bg-amber-500/10 ${isSaved ? "text-amber-500" : "group-hover/btn:text-amber-500"}`}
            >
              <Bookmark size={19} className={isSaved ? "fill-amber-500" : ""} />
            </div>
          </button>
        </div>

        {/* QUICK REPLY: Đồng bộ style với Upload form */}
        {isReplying && (
          <div className="mt-4 flex gap-3 border-l-[1px] border-gray-800 pl-4 animate-in slide-in-from-top-2 duration-300">
            <Avatar className="w-7 h-7 border border-gray-800">
              <AvatarImage src={user?.image || "/bacon.png"} />
            </Avatar>
            <div className="flex flex-col gap-2 grow">
              <textarea
                autoFocus
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Phản hồi cho ${post.author.username}...`}
                className="bg-transparent text-sm text-white resize-none outline-none min-h-[45px] pt-1"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsReplying(false)}
                  className="text-xs font-bold text-gray-500 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 disabled:opacity-40 transition-all shadow-lg"
                >
                  Phản hồi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
