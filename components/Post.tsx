"use client";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { getLikeStatus, toggleLike } from "@/lib/actions/post";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import NumberFlow from "@number-flow/react";
import Link from "next/link";
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
}

export default function Post({ post }: { post: Post }) {
  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [repliesCount, setRepliesCount] = useState(post.replies_count);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { user } = useAuth();

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: replyContent, parent_id: post.id }),
    });
    const result = await response.json();
    console.log(result);

    setRepliesCount((prev) => prev + 1);
    setReplyContent("");
    setIsReplying(false);
  };

  useEffect(() => {
    async function fetchLikeStatus() {
      const res = await getLikeStatus(post.id);
      setIsLike(res);
    }
    fetchLikeStatus();
  }, []);

  return (
    <article
      key={post.id}
      className="py-4 border-b border-purple-900/20 flex gap-3"
    >
      {/* Cột trái: Avatar và đường kẻ nối */}
      <div className="flex flex-col items-center">
        <Link href={`/user/${post.author?.id}`}>
          <Avatar>
            <AvatarImage
              src={
                post.author?.image
                  ? post.author.image
                  : "https://img.icons8.com/nolan/1200/user-default.jpg"
              }
              className="bg-purple-900"
            ></AvatarImage>
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Link>
        <div className="w-[2px] grow bg-purple-900/30 my-2 rounded-full"></div>
      </div>

      {/* Cột phải: Nội dung */}
      <Link
        className="flex flex-col gap-1 w-full min-w-0"
        href={`/post/${post.id}`}
      >
        <div className="flex gap-5 items-center">
          <h4 className="font-bold text-sm hover:underline cursor-pointer">
            {post.author?.username}
          </h4>
          {/* <span className="text-purple-400/50 text-xs">Time</span> */}
        </div>
        <p className="text-[15px] leading-relaxed text-purple-100  wrap-break-word whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Tương tác */}
        <div className="flex gap-4 mt-3 text-purple-300">
          <Heart
            fill={isLike ? "pink" : "none"}
            size={20}
            className="hover:text-pink-500 cursor-pointer transition "
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();

              if (!user) return (window.location.href = "/login");

              setIsLike(!isLike);
              if (isLike) {
                setLikesCount(likesCount - 1);
              } else {
                setLikesCount(likesCount + 1);
              }
              await toggleLike(post.id);
            }}
          />
          <NumberFlow value={likesCount}></NumberFlow>
          {/* ... phần code cũ ... */}
          <MessageCircle
            size={20}
            className="hover:text-purple-400 cursor-pointer transition"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsReplying(!isReplying);
            }}
          />
          <NumberFlow value={repliesCount}></NumberFlow>

          <Repeat2
            size={20}
            className="hover:text-green-400 cursor-pointer transition"
          />
          <Send
            size={20}
            className="hover:text-blue-400 cursor-pointer transition"
          />
        </div>
        {isReplying && (
          <div
            className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.preventDefault()}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  user?.image ||
                  "https://img.icons8.com/nolan/1200/user-default.jpg"
                }
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col grow gap-2">
              <textarea
                autoFocus
                placeholder={`Trả lời ${post.author.username}...`}
                className="w-full bg-transparent border-none text-sm text-purple-100 focus:ring-0 resize-none outline-none p-0"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  disabled={!replyContent.trim()}
                  onClick={handleReply}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-1 rounded-full text-xs font-bold transition"
                >
                  Đăng
                </button>
              </div>
            </div>
          </div>
        )}
      </Link>
    </article>
  );
}
