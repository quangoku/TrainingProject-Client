import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserById } from "@/lib/actions/user";
import Setting from "./_components/Setting";
import FollowListModal from "./_components/Follow";
import { getPostByUserId } from "@/lib/actions/post";
import Post from "@/components/Post";

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
  const posts = await getPostByUserId(parseInt(id));
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
              src={
                user.image
                  ? user.image
                  : "https://img.icons8.com/nolan/1200/user-default.jpg"
              }
              alt="Avatar"
              className="rounded-full bg-purple-800 object-cover"
            />
          </div>
        </div>

        {/* BIO & LINKS */}
        <div className="mb-6 space-y-3">
          <p className="text-sm text-purple-100">{user.bio}</p>
          <div className="flex items-center gap-4 text-sm">
            {/* Nút Người theo dõi */}
            <FollowListModal
              userId={user.id}
              type="followers"
              count={user.followers_count}
              triggerText="người theo dõi"
            />

            {/* Nút Đang theo dõi */}
            <FollowListModal
              userId={user.id}
              type="following"
              count={user.following_count}
              triggerText="đang theo dõi"
            />
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
          </TabsList>

          <TabsContent value="threads" className="mt-2">
            <div className="flex flex-col">
              {posts.map((post) => (
                <Post post={post} key={post.id} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
