"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { User } from "@/types/api/user";

export default function Setting({ profileUser }: { profileUser: User }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopyProfileLink = () => {
    const profileLink = `${window.location.origin}/user/${profileUser.id}`;
    navigator.clipboard.writeText(profileLink);
  };

  const [formData, setFormData] = useState({
    username: profileUser?.username || "",
    bio: profileUser?.bio || "",
  });

  useEffect(() => {
    if (profileUser) {
      setFormData({
        username: profileUser.username,
        bio: profileUser.bio || "",
      });
    }
  }, [profileUser]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/follow/${profileUser.id}`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    const result = await response.json();
    setIsFollowing(result.data);
  };
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!user || user.id === profileUser.id) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/${profileUser.id}/is-following`,
        { credentials: "include" },
      );
      const result = await response.json();
      setIsFollowing(result.data);
    };
    checkFollowingStatus();
  }, [user, profileUser.id]);

  return (
    <>
      {user && user.id === profileUser.id ? (
        <div className="flex gap-3 mb-8">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 cursor-pointer bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all">
                Chỉnh sửa trang cá nhân
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0510]/90 text-white border-gray-800 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  Chỉnh sửa trang cá nhân
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="font-bold">
                    Tên
                  </Label>
                  <Input
                    id="name"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="bg-[#1e1e1e] border-none focus-visible:ring-1 focus-visible:ring-gray-400 h-12"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio" className="font-bold">
                    Tiểu sử
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="+ Viết tiểu sử"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="bg-[#1e1e1e] border-none focus-visible:ring-1 focus-visible:ring-gray-400 min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 rounded-xl"
                >
                  {loading ? "Đang lưu..." : "Xong"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleCopyProfileLink}
            variant="outline"
            className="flex-1 cursor-pointer border-gray-800 bg-transparent hover:bg-white/5 rounded-xl font-bold"
          >
            Chia sẻ trang cá nhân
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 mb-8">
          <Button
            className={`flex-1 font-bold rounded-xl transition-all ${
              isFollowing
                ? "bg-transparent border border-gray-700 text-white"
                : "bg-white text-black"
            }`}
            onClick={handleFollow}
          >
            {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </Button>
        </div>
      )}
    </>
  );
}
