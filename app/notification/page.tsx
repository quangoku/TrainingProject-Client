import NotificationList from "./_components/NotificationList";

export default async function NotificationPage() {
  return (
    <div className="min-h-screen bg-[#0a0510] text-purple-50 flex flex-col items-center pb-20 md:pb-0">
      <NotificationList></NotificationList>
    </div>
  );
}
