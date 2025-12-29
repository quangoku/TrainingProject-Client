"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-purple-500">Opps!</h1>
        <h2 className="text-2xl font-semibold">Đã có lỗi xảy ra</h2>
        <p className="text-purple-300/70 max-w-md mx-auto">
          Chúng tôi rất tiếc vì sự cố này. Vui lòng thử lại hoặc quay về trang
          chủ.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl"
          >
            Thử lại
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="border-purple-900/30 hover:bg-purple-900/10 rounded-xl"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
