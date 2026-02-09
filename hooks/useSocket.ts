import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (userId: number) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (!userId) return;
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: {
        userId: userId,
      },
    });
    console.log("socket connected");
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, [userId]);

  return socket;
};
