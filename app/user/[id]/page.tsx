import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserById } from "@/lib/actions/user";
import { Link as LinkIcon } from "lucide-react";
import Setting from "./_components/Setting";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserById(parseInt(id));

  return {
    title: `${user.username} (@${user.username})`,
    description: user.bio || `Trang cá nhân của ${user.username} trên methread`,
  };
}
export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await getUserById(parseInt(id));
  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50 flex flex-col items-center pb-20">
      <main className="w-full max-w-[600px] px-4 pt-8">
        {/* PROFILE HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <div className="flex items-center gap-2"></div>
          </div>
          <div className="relative w-20 h-20">
            <img
              src={user.image}
              alt="Avatar"
              className="rounded-full bg-purple-800 object-cover"
            />
          </div>
        </div>

        {/* BIO & LINKS */}
        <div className="mb-6 space-y-3">
          <p className="text-sm text-purple-100">{user.bio}</p>
          <div className="flex items-center gap-4 text-sm text-purple-400/60">
            <div className="flex items-center gap-1 hover:underline cursor-pointer">
              <span className="text-purple-100 font-medium">
                {user.followers_count}
              </span>{" "}
              người theo dõi
            </div>
            <div className="flex items-center gap-1 hover:underline cursor-pointer">
              <span className="text-purple-100 font-medium">
                {user.following_count}
              </span>{" "}
              đang theo dõi
            </div>
            <div className="flex items-center gap-1 hover:underline cursor-pointer">
              <LinkIcon className="w-3 h-3" />
              <span>daisydesign.com</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <Setting profileUser={user}></Setting>
        {/* TABS (THREADS, REPLIES, REPOSTS) */}
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="w-full bg-transparent  rounded-none p-0 h-12">
            <TabsTrigger
              value="threads"
              className="flex-1  data-[state=active]:bg-purple-800   data-[state=active]:text-white transition-all"
            >
              Threads
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-50 bg-transparent text-purple-400 data-[state=active]:text-purple-50 transition-all"
            >
              Trả lời
            </TabsTrigger>
            <TabsTrigger
              value="reposts"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-50 bg-transparent text-purple-400 data-[state=active]:text-purple-50 transition-all"
            >
              Bài đăng lại
            </TabsTrigger>
          </TabsList>

          <TabsContent value="threads" className="mt-2">
            <div className="flex flex-col">
              {/* {userPosts.map((post) => (
                <Post post={post} key={post.id} />
              ))} */}
            </div>
          </TabsContent>

          <TabsContent
            value="replies"
            className="py-10 text-center text-purple-400/50"
          >
            Chưa có câu trả lời nào.
          </TabsContent>

          <TabsContent
            value="reposts"
            className="py-10 text-center text-purple-400/50"
          >
            Chưa có bài đăng lại nào.
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
