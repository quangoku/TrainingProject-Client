"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Setting({ profileUser }) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const handleFollow = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/follow/${profileUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const result = await response.json();
    setIsFollowing(result.data);
  };

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!user) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/${profileUser.id}/is-following`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await response.json();
      setIsFollowing(result.data);
    };
    checkFollowingStatus();
  }, [user]);

  return (
    <>
      {user && user.id === profileUser.id ? (
        <div className="flex gap-3 mb-8">
          <Button className="flex-1 cursor-pointer bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all">
            Chỉnh sửa trang cá nhân
          </Button>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer border-purple-900/30 bg-transparent hover:bg-purple-900/10 rounded-xl font-bold"
          >
            Chia sẻ trang cá nhân
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 mb-8">
          <Button
            className=" cursor-pointer flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all"
            onClick={handleFollow}
          >
            {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
          </Button>
        </div>
      )}
    </>
  );
}
