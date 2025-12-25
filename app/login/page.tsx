"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50 flex flex-col items-center justify-center px-4">
      {/* BACKGROUND DECORATION (Optional) */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-purple-900/20 to-transparent -z-10" />

      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* LOGO */}
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center rotate-6 mb-8 shadow-xl shadow-purple-900/20">
          <img src="/icon.png" alt="" className="rounded-3xl" />
          <div className="text-3xl font-bold italic"></div>
        </div>

        <h1 className="text-xl font-bold mb-8">
          Đăng nhập bằng tài khoản của bạn
        </h1>

        {/* FORM */}
        <div className="w-full space-y-3">
          <Input
            name="email"
            type="text"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="Tên người dùng, email hoặc số di động"
            className="bg-purple-900/20 border-purple-900/30 h-14 rounded-xl focus:ring-purple-600 focus:bg-purple-900/40"
          />
          <Input
            name="pasword"
            value={data.password}
            onChange={(e) => {
              setData({ ...data, password: e.target.value });
            }}
            type="password"
            placeholder="Mật khẩu"
            className="bg-purple-900/20 border-purple-900/30 h-14 rounded-xl focus:ring-purple-600 focus:bg-purple-900/40"
          />
          <p className="text-red-500 text-sm">{error}</p>
          <Button
            onClick={async () => {
              const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
              });

              const user = await response.json();
              console.log(user);
              if (response.ok) {
                router.push("/");
              } else {
                setError(
                  "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
                );
              }
            }}
            className="cursor-pointer w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl text-base mt-2 transition-all"
          >
            Đăng nhập
          </Button>
        </div>

        {/* FORGOT PASSWORD */}
        <Link
          href="#"
          className="mt-4 text-sm text-purple-400/70 hover:text-purple-400 transition-colors"
        >
          Quên mật khẩu?
        </Link>

        {/* DIVIDER */}
        <div className="w-full flex items-center gap-4 my-8">
          <div className="h-[1px] flex-1 bg-purple-900/30"></div>
          <span className="text-sm text-purple-400/50 font-medium">HOẶC</span>
          <div className="h-[1px] flex-1 bg-purple-900/30"></div>
        </div>

        {/* SOCIAL LOGIN */}
        <a href="http://localhost:3000/auth/mezon" className="w-full">
          <Button
            variant="outline"
            className="w-full h-14 border-purple-900/30 bg-transparent cursor-pointer rounded-xl flex items-center justify-center gap-3 font-semibold"
          >
            <img src="/icon.png" alt="" className="rounded-3xl size-5" />
            Tiếp tục với Mezon
          </Button>
        </a>
        {/* FOOTER */}
        <footer className="mt-20 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-purple-400/40">
          <span>© 2024 Threads Clone</span>
          <Link href="#" className="hover:underline">
            Điều khoản
          </Link>
          <Link href="#" className="hover:underline">
            Chính sách bảo mật
          </Link>
          <Link href="#" className="hover:underline">
            Báo cáo sự cố
          </Link>
        </footer>
      </div>
    </div>
  );
}
