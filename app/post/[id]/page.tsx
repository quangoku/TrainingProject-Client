import { getPostById, getRepliesByPostId } from "@/lib/actions/post";
import Image from "next/image";
import ParentPost from "./_components/ParentPost";
import Post from "@/components/Post";
import NoReply from "./_components/NoReply";
import NotFound from "./_components/NotFound";

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const post = await getPostById(parseInt(id));
  const replies = await getRepliesByPostId(parseInt(id));
  if (!post) {
    return <NotFound></NotFound>;
  }

  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50   flex flex-col items-center pb-20 md:pb-0">
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

      <main className="w-full max-w-[700px] px-4 border rounded-2xl border-purple-900/30 mt-4 bg-[#0a0510]/50 backdrop-blur-sm">
        <ParentPost post={post}></ParentPost>
        {replies.length > 0 ? (
          replies.map((reply) => {
            return <Post key={reply.id} post={reply}></Post>;
          })
        ) : (
          <NoReply></NoReply>
        )}
      </main>
    </div>
  );
}
