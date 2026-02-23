"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/types/api/user";
import Link from "next/link";

export default function UserComponent({ user }: { user: User }) {
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Followed:", user.id);
  };

  return (
    <Link
      href={`/user/${user.id}`}
      // Thay đổi border thành màu trắng đục (white/10) và hover nhẹ nhàng hơn
      className="flex items-start gap-3 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer px-4 rounded-lg group"
    >
      {/* Avatar - Thêm border mờ để nổi bật trên nền đen */}
      <div className="relative w-11 h-11 shrink-0">
        <img
          src={
            user.image || "https://img.icons8.com/nolan/1200/user-default.jpg"
          }
          alt={user.username}
          className="rounded-full bg-[#1c1d24] w-full h-full object-cover border border-white/10"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            {/* Tên người dùng màu trắng thuần */}
            <span className="font-bold text-[15px] text-white hover:underline tracking-tight truncate">
              {user.username}
            </span>
            {/* Bio màu xám nhạt (zinc/400) */}
            <span className="text-zinc-400 text-[14px] leading-tight line-clamp-1 mt-0.5">
              {user.bio || "Chưa có tiểu sử"}
            </span>
          </div>

          {/* Button: Nền trắng, chữ đen để tạo sự tương phản mạnh (High Contrast) */}
          <Button
            onClick={handleFollow}
            variant="outline"
            className="bg-white text-black border-none hover:bg-zinc-200 cursor-pointer rounded-xl px-5 h-8 transition-all font-bold text-sm shrink-0"
          >
            Theo dõi
          </Button>
        </div>

        {/* Số người theo dõi: Màu xám bạc mờ */}
        <div className="mt-2">
          <span className="text-[13px] font-normal text-zinc-500">
            {user.followers_count?.toLocaleString() || 0} người theo dõi
          </span>
        </div>
      </div>
    </Link>
  );
}
