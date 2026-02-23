import { Metadata } from "next";
import UserList from "./_components/UserList";

export const metadata: Metadata = {
  title: "MeThreads - Search",
  description: "Searching for user",
};
export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/users/random`,
  );
  const result = await response.json();
  const suggestedUsers = result.data;
  return (
    <div className="min-h-screen bg-[#111217] text-purple-50 flex flex-col items-center pb-20 md:pb-0">
      <UserList users={suggestedUsers} />
    </div>
  );
}
