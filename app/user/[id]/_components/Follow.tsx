"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface UserSummary {
  id: number;
  username: string;
  image: string;
}

interface FollowListModalProps {
  userId: number;
  type: "followers" | "following";
  count: number;
  triggerText: string;
}

export default function FollowListModal({
  userId,
  type,
  count,
  triggerText,
}: FollowListModalProps) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/${userId}/${type}`
      );
      if (res.ok) {
        const result = await res.json();
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 hover:underline cursor-pointer">
          <span className="text-purple-100 font-medium">{count}</span>{" "}
          <span className="text-purple-400/60">{triggerText}</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-[#120a1c] border-purple-900/50 text-purple-50 max-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center capitalize">
            {type === "followers" ? "Người theo dõi" : "Đang theo dõi"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2 custom-scrollbar">
          {loading ? (
            <div className="text-center py-4 text-purple-400">Đang tải...</div>
          ) : users.length > 0 ? (
            users.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                <Link
                  href={`/profile/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 flex-1"
                >
                  <Avatar className="h-10 w-10 border border-purple-800">
                    <AvatarImage src={item.image} />
                    <AvatarFallback className="bg-purple-900">
                      {item.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold hover:underline">
                      {item.username}
                    </span>
                  </div>
                </Link>
                {/* Bạn có thể thêm nút Follow/Unfollow nhanh ở đây nếu muốn */}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-purple-400/50 italic">
              Danh sách trống
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
