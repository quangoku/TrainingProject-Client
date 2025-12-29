import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoginForm from "./_components/LoginForm";
export default function LoginPage() {
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
        <LoginForm></LoginForm>
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
            className="w-full h-14 border-purple-900/30 bg-purple-700 cursor-pointer rounded-xl gap-3 "
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
