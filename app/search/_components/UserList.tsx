"use client";
import { Search } from "lucide-react";
import UserComponent from "./User";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { User } from "@/types/api/user";

export default function UserList({ users }: { users: User[] }) {
  const [userList, setUserList] = useState(users);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState(searchName);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchName(searchName);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchName]);

  useEffect(() => {
    const fetchSearchUsers = async () => {
      if (debouncedSearchName.trim() === "") {
        setUserList(users);
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/search?q=${debouncedSearchName}`,
      );
      const result = await response.json();
      console.log(result);
      setUserList(result.data);
    };

    fetchSearchUsers();
  }, [debouncedSearchName, users]);

  return (
    <>
      <header className="w-full max-w-[600px] px-4 pt-6 pb-2 sticky top-0 bg-[#0a0510]/80 backdrop-blur-md z-50">
        <h1 className="text-2xl font-bold mb-4 ml-1 text-center">Tìm kiếm</h1>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50 group-focus-within:text-purple-400 transition-colors" />
          <Input
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
            placeholder="Tìm kiếm"
            value={searchName}
            className="w-full bg-purple-900/20 border-purple-900/30 pl-10 h-11 rounded-xl focus-visible:ring-purple-600 focus-visible:bg-purple-900/40 transition-all placeholder:text-purple-400/30"
          />
        </div>
      </header>

      <main className="w-full max-w-[600px] px-4 mt-2 border h-screen rounded-2xl border-purple-900/30 overflow-y-auto">
        {userList.map((user) => (
          <UserComponent user={user} key={user.id}></UserComponent>
        ))}
      </main>
      <div className="flex flex-col space-y-1"></div>
    </>
  );
}
