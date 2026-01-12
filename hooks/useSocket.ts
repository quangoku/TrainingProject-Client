// hooks/useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!userId) return;
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: {
        userId: userId,
      },
    });
    console.log("socket connected ");

    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, [userId]);

  return socket;
};
