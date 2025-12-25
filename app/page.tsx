import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function ThreadsPage() {
  const res = await fetch("http://localhost:3000/posts", {
    credentials: "include",
  });
  const result = await res.json();
  const posts = result.data;
  console.log(posts);

  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50 flex flex-col items-center pb-20 md:pb-0">
      {/* HEADER (Logo) */}
      <header className="w-full max-w-[600px] h-16 flex items-center justify-center sticky top-0 bg-[#0a0510]/80 backdrop-blur-md z-50">
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
      <main className="w-full max-w-[600px] px-4 border rounded-2xl border-purple-900/30 mt-4 bg-[#0a0510]/50 backdrop-blur-sm">
        {/* CREATE POST INPUT (Chỉ hiển thị desktop/tablet giả lập) */}
        <div className="hidden md:flex items-center gap-3 py-4 border-b border-purple-900/30">
          <div className="w-10 h-10 rounded-full bg-purple-800 shrink-0"></div>
          <div className="flex-1">
            <p className="text-purple-400/50 text-sm">Có gì mới?</p>
          </div>
          <Button className="ml-auto px-4 py-1.5 bg-purple-600  text-sm font-semibold hover:bg-purple-500 transition cursor-pointer">
            Đăng
          </Button>
        </div>

        {/* FEED */}
        <div className="flex flex-col">
          {posts.map((post) => (
            <Post post={post} key={post.id}></Post>
          ))}
        </div>
      </main>

      {/* NAVIGATION BAR (Mobile bottom, Desktop Sidebar) */}
    </div>
  );
}
