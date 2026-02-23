import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#111217] text-[#e2e8f0] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* BACKGROUND DECORATION - Làm mờ hơn để tạo chiều sâu */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] -z-10 opacity-40" />

      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* LOGO - Chỉnh lại shadow để nổi bật trên nền đen */}
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center rotate-6 mb-8 shadow-2xl shadow-purple-500/10">
          <img src="/meblox.png" alt="Logo" className="rounded-xl w-15 h-15 " />
        </div>

        <h1 className="text-2xl font-bold mb-2 tracking-tight">
          Chào mừng trở lại
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Đăng nhập bằng tài khoản của bạn
        </p>

        {/* FORM */}
        <div className="w-full">
          <LoginForm />
        </div>

        {/* DIVIDER - Dùng màu slate/zinc để trông hiện đại hơn */}
        <div className="w-full flex items-center gap-4 my-8">
          <div className="h-[1px] flex-1 bg-gray-800"></div>
          <span className="text-[10px] text-gray-500 font-bold tracking-widest">
            HOẶC
          </span>
          <div className="h-[1px] flex-1 bg-gray-800"></div>
        </div>

        {/* SOCIAL LOGIN */}
        <div className="w-full space-y-3">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/mezon`}
            className="block w-full"
          >
            <Button
              variant="outline"
              className="w-full h-12 border-gray-800 bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all cursor-pointer rounded-xl gap-3 border-none"
            >
              <img src="/icon.png" alt="" className="rounded-full size-5" />
              Tiếp tục với Mezon
            </Button>
          </a>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/roblox`}
            className="block w-full"
          >
            <Button
              variant="outline"
              className="w-full h-12 border-gray-800 bg-[#2b2d31] hover:bg-[#313338] text-white transition-all cursor-pointer rounded-xl gap-3"
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
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-white">
            Đăng ký ngay
          </Link>
        </div>

        {/* FOOTER */}
        <footer className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-gray-600 uppercase tracking-wider">
          <span className="text-gray-700">© 2026 MeBlox</span>
          <Link href="#" className="hover:text-gray-400 transition-colors">
            Điều khoản
          </Link>
          <Link href="#" className="hover:text-gray-400 transition-colors">
            Bảo mật
          </Link>
          <Link href="#" className="hover:text-gray-400 transition-colors">
            Hỗ trợ
          </Link>
        </footer>
      </div>
    </div>
  );
}
