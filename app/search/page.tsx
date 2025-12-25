import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchPage() {
  const suggestedUsers = [
    {
      id: 1,
      name: "the_rock",
      displayName: "Dwayne Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dwayne",
      followers: "390M followers",
    },
    {
      id: 2,
      name: "coding_ninja",
      displayName: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      followers: "12K followers",
    },
    {
      id: 3,
      name: "vercel_official",
      displayName: "Vercel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vercel",
      followers: "85K followers",
    },
    // Thêm các user khác...
  ];

  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50 flex flex-col items-center pb-20 md:pb-0">
      {/* HEADER SEARCH */}
      <header className="w-full max-w-[600px] px-4 pt-6 pb-2 sticky top-0 bg-[#0a0510]/80 backdrop-blur-md z-50">
        <h1 className="text-2xl font-bold mb-4 ml-1 text-center">Tìm kiếm</h1>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50 group-focus-within:text-purple-400 transition-colors" />
          <Input
            placeholder="Tìm kiếm"
            className="w-full bg-purple-900/20 border-purple-900/30 pl-10 h-11 rounded-xl focus-visible:ring-purple-600 focus-visible:bg-purple-900/40 transition-all placeholder:text-purple-400/30"
          />
        </div>
      </header>

      {/* SEARCH RESULTS / SUGGESTIONS */}
      <main className="w-full max-w-[600px] px-4 mt-2 border h-screen rounded-2xl border-purple-900/30 overflow-y-auto">
        <div className="flex flex-col space-y-1">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-start gap-3 py-4 border-b border-purple-900/10 last:border-0 hover:bg-purple-900/5 transition-colors cursor-pointer px-2 rounded-lg"
            >
              {/* Avatar */}
              <div className="relative w-10 h-10 shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="rounded-full bg-purple-800"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 border-b border-purple-900/20 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm hover:underline tracking-tight">
                      {user.name}
                    </span>
                    <span className="text-purple-400/60 text-sm">
                      {user.displayName}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-purple-800 text-purple-50 bg-purple-800 cursor-pointer hover:text-black rounded-xl px-6 h-9 transition-all font-semibold"
                  >
                    Theo dõi
                  </Button>
                </div>
                <div className="mt-1">
                  <span className="text-sm font-medium">{user.followers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
