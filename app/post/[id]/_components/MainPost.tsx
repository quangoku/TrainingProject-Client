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
}

export default function MainPost({ post }: { post: Post }) {
  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [repliesCount, setRepliesCount] = useState(post.replies_count);

  const { user } = useAuth();

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
      className="py-4   border-b border-purple-900/20 flex gap-3 flex-col "
    >
      <div className="flex gap-3 ">
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
        <h4 className="font-bold text-sm hover:underline cursor-pointer">
          {post.author?.username}
        </h4>
      </div>

      {/* Cột phải: Nội dung */}

      <div className="flex flex-col gap-1 w-full" href={`/post/${post.id}`}>
        <div className="flex gap-5 items-center">
          <span className="text-purple-400/50 text-xs">{post.time}</span>
        </div>
        <p className="text-[15px] leading-relaxed text-purple-100">
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
          <MessageCircle
            size={20}
            className="hover:text-purple-400 cursor-pointer transition"
          />
          {repliesCount}
          <Repeat2
            size={20}
            className="hover:text-green-400 cursor-pointer transition"
          />
          <Send
            size={20}
            className="hover:text-blue-400 cursor-pointer transition"
          />
        </div>
        <div className="border border-pink-300 mt-3"></div>
      </div>
    </article>
  );
}
