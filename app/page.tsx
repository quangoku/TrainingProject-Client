import PostList from "@/components/PostList";
import Upload from "@/components/Upload";
import Image from "next/image";
export const dynamic = "force-dynamic";
export default async function ThreadsPage() {
  return (
    <div className="min-h-screen bg-[#111217] text-purple-50 flex flex-col items-center pb-20 md:pb-0">
      <header className="w-full max-w-[700px] h-16 flex items-center justify-center sticky top-0 bg-[#111217]/80 backdrop-blur-md z-50">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center rotate-3">
          <Image
            src="/meblox.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-full"
          ></Image>
        </div>
      </header>

      <main className="w-full max-w-[700px] px-4 border rounded-2xl border-gray-800/60 mt-4 bg-[#111217]/50 backdrop-blur-sm">
        <Upload />
        <PostList></PostList>
      </main>
    </div>
  );
}
