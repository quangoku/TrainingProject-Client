"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LoginForm() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (response.ok) {
        window.location.href = "/";
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full space-y-3">
      <Input
        name="email"
        type="text"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        placeholder="Tên người dùng, email hoặc số di động"
        className="bg-purple-900/20 border-purple-900/30 h-14 rounded-xl focus:ring-purple-600 focus:bg-purple-900/40"
      />
      <Input
        name="password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        type="password"
        placeholder="Mật khẩu"
        className="bg-purple-900/20 border-purple-900/30 h-14 rounded-xl focus:ring-purple-600 focus:bg-purple-900/40"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        className="cursor-pointer w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl text-base mt-2 transition-all"
      >
        Đăng nhập
      </Button>
    </form>
  );
}
