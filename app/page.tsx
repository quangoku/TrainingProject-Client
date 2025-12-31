import PostList from "@/components/PostList";
import Upload from "@/components/Upload";
import { getPosts } from "@/lib/actions/post";
import Image from "next/image";

export default async function ThreadsPage() {
  const data = await getPosts();
  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50 flex flex-col items-center pb-20 md:pb-0">
      {/* HEADER (Logo) */}
      <header className="w-full max-w-[700px] h-16 flex items-center justify-center sticky top-0 bg-[#0a0510]/80 backdrop-blur-md z-50">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center rotate-3">
          <Image
            src="/icon.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-full"
          ></Image>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}

      <main className="w-full max-w-[700px] px-4 border rounded-2xl border-purple-900/30 mt-4 bg-[#0a0510]/50 backdrop-blur-sm">
        {/* CREATE POST INPUT (Chỉ hiển thị desktop/tablet giả lập) */}
        <Upload />
        {/* FEED */}
        <PostList initData={data}></PostList>
      </main>

      {/* NAVIGATION BAR (Mobile bottom, Desktop Sidebar) */}
    </div>
  );
}
