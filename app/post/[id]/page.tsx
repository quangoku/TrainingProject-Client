import { getPostById } from "@/lib/actions/post";
import Image from "next/image";
import ParentPost from "./_components/ParentPost";
import NotFound from "./_components/NotFound";
import RepliesList from "./_components/RepliesList";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const post = await getPostById(parseInt(id));

  if (!post) {
    return <NotFound />;
  }

  return (
    // Đổi bg sang #111217 và text sang trắng/xám zinc
    <div className="min-h-screen bg-[#111217] text-zinc-100 flex flex-col items-center pb-20 md:pb-0 font-sans">
      {/* Header: Sticky với hiệu ứng glassmorphism nhẹ trên nền tối */}
      <header className="w-full max-w-[700px] h-16 flex items-center justify-center sticky top-0 bg-[#111217]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-white/5">
          <Image
            src="/meblox.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg object-contain"
          />
        </div>
      </header>

      {/* Main content: Bỏ border tím, dùng border trắng mờ hoặc bỏ hẳn border ngoài cho giống Threads */}
      <main className="w-full max-w-[700px] px-4 mt-2 bg-transparent">
        {/* Post gốc */}
        <div className="border-b border-white/5">
          <ParentPost post={post} />
        </div>

        {/* Phần trả lời */}
        <RepliesList postId={parseInt(id)}></RepliesList>
      </main>
    </div>
  );
}
