"use client";

import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "@/components/auth/AuthProvider";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export function useSocket(
  onNotification?: (data: { type: string; title: string; message: string; link?: string }) => void
): Socket | null {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectSocket();
      socketRef.current = null;
      return;
    }

    const socket = connectSocket(token);
    socketRef.current = socket;

    if (onNotification) {
      socket.on("notification", onNotification);
    }

    return () => {
      if (onNotification) {
        socket.off("notification", onNotification);
      }
    };
  }, [isAuthenticated, token, onNotification]);

  return socketRef.current;
}
