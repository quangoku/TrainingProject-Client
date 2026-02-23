"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import { getNotification } from "@/lib/actions/notification";
import { Notification } from "@/types/api/Notification";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[] | null>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await getNotification();
        setNotifications(result || []);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <>
      <header className="w-full max-w-[600px] px-4 pt-6 pb-2 sticky top-0 bg-[#111217]/80 backdrop-blur-md z-50">
        <h1 className="text-2xl font-bold mb-4 ml-1">Thông báo</h1>
      </header>

      <main className="w-full max-w-[600px] px-4 mt-2 h-screen rounded-2xl border-x border-gray-800/60 overflow-y-auto">
        {loading ? (
          <div className="text-center py-10 text-purple-400/50">
            Đang tải...
          </div>
        ) : notifications?.length && notifications.length > 0 ? (
          notifications?.map((noti) => (
            <NotificationItem key={noti._id} notification={noti} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-800/60">
            <Bell className="w-12 h-12 mb-2 opacity-20" />
            <p>Chưa có thông báo nào</p>
          </div>
        )}
      </main>
    </>
  );
}
