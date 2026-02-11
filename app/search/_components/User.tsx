import { Button } from "@/components/ui/button";
import { User } from "@/types/api/user";
import Link from "next/link";

export default function UserComponent({ user }: { user: User }) {
  return (
    <Link
      href={`/user/${user.id}`}
      key={user.id}
      className="flex items-start gap-3 py-4 border-b border-purple-900/10 last:border-0 hover:bg-purple-900/5 transition-colors cursor-pointer px-2 rounded-lg"
    >
      {/* Avatar */}
      <div className="relative w-10 h-10 shrink-0">
        <img
          src={
            user.image
              ? user.image
              : "https://img.icons8.com/nolan/1200/user-default.jpg"
          }
          alt={user.username}
          className="rounded-full bg-purple-800"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0 border-b border-purple-900/20 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-bold text-sm hover:underline tracking-tight">
              {user.username}
            </span>
            <span className="text-purple-400/60 text-sm">{user.bio}</span>
          </div>
          <Button
            variant="outline"
            className="border-purple-800 text-purple-50 bg-purple-800 cursor-pointer hover:text-black rounded-xl px-6 h-9 transition-all font-semibold"
          >
            Theo dõi
          </Button>
        </div>
        <div className="mt-1">
          <span className="text-sm font-medium">
            {user.followers_count} người theo dõi
          </span>
        </div>
      </div>
    </Link>
  );
}
