"use client";
import { Search, Loader2 } from "lucide-react";
import UserComponent from "./User";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { User } from "@/types/api/user";

export default function UserList({ users }: { users: User[] }) {
  const [userList, setUserList] = useState(users);
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Khởi tạo AbortController để cancel request nếu searchName thay đổi nhanh
    const controller = new AbortController();

    const handler = setTimeout(async () => {
      if (searchName.trim() === "") {
        setUserList(users);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/search?q=${encodeURIComponent(searchName)}`,
          { signal: controller.signal },
        );
        const result = await response.json();
        setUserList(result.data || []);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
      controller.abort(); // Hủy request cũ nếu user tiếp tục gõ
    };
  }, [searchName, users]);

  return (
    <>
      <header className="w-full max-w-[600px] px-4 pt-6 pb-2 sticky top-0 bg-[#111217]/80 backdrop-blur-md z-50">
        <h1 className="text-2xl font-bold mb-4 ml-1 text-center">Tìm kiếm</h1>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-purple-400/50 group-focus-within:text-purple-400 transition-colors" />
            )}
          </div>
          <Input
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Tìm kiếm"
            value={searchName}
            className="w-full bg-gray-800/60 border-white pl-10 h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500  transition-all"
          />
        </div>
      </header>

      <main className="w-full max-w-[600px] px-4 mt-2 min-h-[50vh]">
        <div className="space-y-4">
          {userList.length > 0
            ? userList.map((user) => (
                <UserComponent user={user} key={user.id} />
              ))
            : !isLoading && (
                <div className="text-center py-10 text-gray-500">
                  Không tìm thấy kết quả cho "{searchName}"
                </div>
              )}
        </div>
      </main>
    </>
  );
}
