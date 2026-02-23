import { Button } from "@/components/ui/button";
import Link from "next/link";
import RegisterForm from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#111217] text-slate-200 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Hiệu ứng ánh sáng tím mờ ở phía trên */}
      <div className="absolute top-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,#3b0764,transparent)] -z-10 opacity-30" />

      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* LOGO */}
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center rotate-6 mb-5 shadow-2xl shadow-purple-900/40">
          <img
            src="/meblox.png"
            alt="Logo"
            className="rounded-xl w-15 h-15 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mb-5 tracking-tight text-white">
          Tạo tài khoản mới
        </h1>

        {/* FORM */}
        <div className="w-full">
          <RegisterForm />
        </div>

        {/* DIVIDER */}
        <div className="w-full flex items-center gap-4 my-8">
          <div className="h-[1px] flex-1 bg-purple-900/30"></div>
          <span className="text-[10px] text-purple-400/40 font-bold tracking-widest">
            HOẶC
          </span>
          <div className="h-[1px] flex-1 bg-purple-900/30"></div>
        </div>

        {/* SOCIAL LOGIN GROUP */}
        <div className="w-full flex flex-col gap-3">
          {/* MEZON */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/mezon`}
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full h-14 border-none bg-purple-700 hover:bg-purple-600 text-white cursor-pointer rounded-xl gap-3 transition-all shadow-lg shadow-purple-900/20"
            >
              <img src="/icon.png" alt="" className="rounded-full size-5" />
              Tiếp tục với Mezon
            </Button>
          </a>

          {/* ROBLOX */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/roblox`}
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full h-14 border-gray-800 bg-[#1e1f26] hover:bg-[#2b2d31] text-white cursor-pointer rounded-xl gap-3 transition-all"
            >
              <img
                src="/meblox.png"
                alt=""
                className="rounded-lg size-5 bg-white p-0.5"
              />
              Tiếp tục với Roblox
            </Button>
          </a>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-purple-400 font-semibold hover:text-purple-300 hover:underline transition-colors"
          >
            Đăng nhập
          </Link>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-purple-400/30 uppercase tracking-wider">
          <span>© 2026 Threads Clone</span>
          <Link href="#" className="hover:text-purple-400/60 transition-colors">
            Điều khoản
          </Link>
          <Link href="#" className="hover:text-purple-400/60 transition-colors">
            Bảo mật
          </Link>
          <Link href="#" className="hover:text-purple-400/60 transition-colors">
            Báo cáo
          </Link>
        </footer>
      </div>
    </div>
  );
}
