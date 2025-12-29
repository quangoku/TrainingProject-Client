import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link as LinkIcon } from "lucide-react";

export default function ProfilePage() {
  const userPosts = [
    {
      id: 1,
      user: "daisy_design",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy",
      content: "Đây là bài viết của chính tôi trên trang cá nhân!",
      image:
        "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/04/hinh-nen-roblox-thumbnail.jpg",
      likes: 450,
      replies: 24,
      time: "1d",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50 flex flex-col items-center pb-20">
      <main className="w-full max-w-[600px] px-4 pt-8">
        {/* PROFILE HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Daisy Design</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">daisy_design</span>
              <span className="bg-purple-900/40 text-purple-400 text-[10px] px-2 py-0.5 rounded-full">
                threads.net
              </span>
            </div>
          </div>
          <div className="relative w-20 h-20">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy"
              alt="Avatar"
              className="rounded-full bg-purple-800 object-cover"
            />
          </div>
        </div>

        {/* BIO & LINKS */}
        <div className="mb-6 space-y-3">
          <p className="text-sm text-purple-100">
            UI/UX Designer & Roblox Enthusiast. 🎨 <br />
            Xây dựng những thứ thú vị với Next.js và Tailwind.
          </p>
          <div className="flex items-center gap-4 text-sm text-purple-400/60">
            <div className="flex items-center gap-1 hover:underline cursor-pointer">
              <span className="text-purple-100 font-medium">1.2K</span> người
              theo dõi
            </div>
            <div className="flex items-center gap-1 hover:underline cursor-pointer">
              <LinkIcon className="w-3 h-3" />
              <span>daisydesign.com</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mb-8">
          <Button className="flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all">
            Chỉnh sửa trang cá nhân
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-purple-900/30 bg-transparent hover:bg-purple-900/10 rounded-xl font-bold"
          >
            Chia sẻ trang cá nhân
          </Button>
        </div>

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
              {userPosts.map((post) => (
                <Post post={post} key={post.id} />
              ))}
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
