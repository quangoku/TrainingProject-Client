import { Metadata } from "next";
import SavedPostList from "./_components/SavedPostList";

export const metadata: Metadata = {
  title: "Meblox - Saved Posts",
  description: "Saved Posts",
};

export default async function ThreadsPage() {
  return (
    <div className="min-h-screen bg-[#111217] text-purple-50 flex flex-col items-center pb-20 md:pb-0">
      <header className="w-full max-w-[700px] h-16 flex items-center justify-center sticky top-0 bg-[#111217]/80 backdrop-blur-md z-50">
        <p>Bài viết đã lưu</p>
      </header>

      <main className="w-full max-w-[700px] px-4 border rounded-2xl border-gray-800/60 mt-4 bg-[#111217]/50 backdrop-blur-sm">
        <SavedPostList></SavedPostList>
      </main>
    </div>
  );
}
