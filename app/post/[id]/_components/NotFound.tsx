"use client";

import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-[#0a0510] h-screen">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-purple-600 blur-[50px] opacity-20 rounded-full"></div>
        <div className="relative w-24 h-24 bg-purple-900/30 border border-purple-500/30 rounded-full flex items-center justify-center">
          <FileQuestion size={48} className="text-purple-400" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-purple-50 mb-2">
        Không tìm thấy bài viết
      </h1>
      <p className="text-purple-400/60 text-sm max-w-[300px] mb-8">
        Xin lỗi, bài viết này không tồn tại hoặc đã bị gỡ bỏ bởi người dùng.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[400px]">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex-1 border-purple-900/50 bg-transparent hover:bg-purple-900/20 text-purple-200 gap-2 rounded-xl h-12"
        >
          <ArrowLeft size={18} />
          Quay lại
        </Button>

        <Button
          asChild
          className="flex-1 bg-purple-600 hover:bg-purple-500 text-white gap-2 rounded-xl h-12 shadow-lg shadow-purple-900/20"
        >
          <Link href="/">
            <Home size={18} />
            Trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}
