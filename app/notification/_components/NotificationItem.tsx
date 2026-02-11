"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/lib/actions/user";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { markAsRead } from "@/lib/actions/notification";
import { Notification } from "@/types/api/Notification";
interface User {
  username: string;
  image: string;
}

export default function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const { _id, content, createdAt, isRead, senderId, postId } = notification;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const handleNavigateToPost = async (postId: number) => {
    console.log(_id);
    await markAsRead(_id);
    router.push(`/post/${postId}`);
  };

  useEffect(() => {
    async function fetchUser() {
      const response = await getUserById(senderId);
      setUser(response);
    }
    if (senderId) {
      fetchUser();
    }
  }, []);

  return (
    <div
      onClick={() => {
        handleNavigateToPost(postId);
      }}
      className={`cursor-pointer flex items-start gap-3 p-4 border-b border-purple-900/10 transition-colors hover:bg-purple-900/5 ${!isRead ? "bg-purple-900/10" : ""}`}
    >
      <Avatar className="w-10 h-10 border border-purple-900/30">
        <AvatarImage src={user?.image} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm text-purple-100">
            <span className="font-bold mr-1">{user?.username}</span>
            <span className="text-purple-200/80">{content}</span>
          </p>
        </div>

        <span className="text-xs text-purple-400/60 mt-1">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: vi,
          })}
        </span>
      </div>

      {!isRead && (
        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
      )}
    </div>
  );
}
