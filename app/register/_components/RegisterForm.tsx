"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Dùng để hiển thị icon loading

export default function LoginForm() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm validate dữ liệu trước khi gửi
  const validateForm = () => {
    if (
      !data.username ||
      !data.email ||
      !data.password ||
      !data.confirmPassword
    ) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Email không hợp lệ.");
      return false;
    }
    if (data.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(""); // Reset lỗi cũ

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok) {
        window.location.href = "/login";
      } else {
        setError(result.description || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm helper để update state nhanh
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleRegister} className="w-full space-y-3">
      <Input
        name="username"
        type="text"
        value={data.username}
        onChange={handleChange}
        placeholder="Tên người dùng"
        className="bg-gray border-white h-14 rounded-xl focus:ring-white focus:bg-white"
      />
      <Input
        name="email"
        type="email"
        value={data.email}
        onChange={handleChange}
        placeholder="Email"
        className="bg-gray border-white h-14 rounded-xl focus:ring-white focus:bg-white"
      />
      <Input
        name="password"
        type="password"
        value={data.password}
        onChange={handleChange}
        placeholder="Mật khẩu"
        className="bg-gray border-white h-14 rounded-xl focus:ring-white focus:bg-white"
      />
      <Input
        name="confirmPassword"
        type="password"
        value={data.confirmPassword}
        onChange={handleChange}
        placeholder="Xác nhận mật khẩu"
        className="bg-gray border-white h-14 rounded-xl focus:ring-white focus:bg-white"
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button
        disabled={isLoading}
        type="submit"
        className="cursor-pointer w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl text-base mt-2 transition-all flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          "Đăng ký"
        )}
      </Button>
    </form>
  );
}
