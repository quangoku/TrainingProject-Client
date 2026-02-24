import { Metadata } from "next";
import NotificationList from "./_components/NotificationList";

export const metadata: Metadata = {
  title: "Meblox - Notifications",
  description: "Notifications",
};

export default async function NotificationPage() {
  return (
    <div className="min-h-screen bg-[#111217] text-purple-50 flex flex-col items-center pb-20 md:pb-0">
      <NotificationList></NotificationList>
    </div>
  );
}
