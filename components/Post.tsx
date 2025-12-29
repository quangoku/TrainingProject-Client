import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export default function Post({ post }: { post: any }) {
  return (
    <article
      key={post.id}
      className="py-4 border-b border-purple-900/20 flex gap-3"
    >
      {/* Cột trái: Avatar và đường kẻ nối */}
      <div className="flex flex-col items-center">
        <Avatar>
          <AvatarImage
            src={
              post.author?.image
                ? post.author.image
                : "https://img.icons8.com/nolan/1200/user-default.jpg"
            }
            className="bg-purple-900"
          ></AvatarImage>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="w-[2px] grow bg-purple-900/30 my-2 rounded-full"></div>
      </div>

      {/* Cột phải: Nội dung */}
      <div className="flex flex-col gap-1 w-full">
        <div className="flex gap-5 items-center">
          <h4 className="font-bold text-sm hover:underline cursor-pointer">
            {post.author?.username}
          </h4>
          <span className="text-purple-400/50 text-xs">{post.time}</span>
        </div>
        <p className="text-[15px] leading-relaxed text-purple-100">
          {post.content}
        </p>

        {post.image && (
          <div className="mt-3 rounded-xl overflow-hidden border border-purple-800/30">
            <img
              src={post.image}
              alt="post content"
              className="w-full object-cover max-h-50
                      "
            />
          </div>
        )}

        {/* Tương tác */}
        <div className="flex gap-4 mt-3 text-purple-300">
          <Heart
            size={20}
            className="hover:text-pink-500 cursor-pointer transition"
          />
          {post.likes_count}
          <MessageCircle
            size={20}
            className="hover:text-purple-400 cursor-pointer transition"
          />
          {post.replies_count}
          <Repeat2
            size={20}
            className="hover:text-green-400 cursor-pointer transition"
          />
          <Send
            size={20}
            className="hover:text-blue-400 cursor-pointer transition"
          />
        </div>
      </div>
    </article>
  );
}
