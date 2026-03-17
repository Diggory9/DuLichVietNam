import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

let io: Server | null = null;

// Map userId -> Set of socketIds (user can have multiple tabs)
const userSockets = new Map<string, Set<string>>();

export function initSocketIO(httpServer: HTTPServer): Server {
  const allowedOrigins = env.corsOrigin
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // JWT authentication middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;

    // Track user socket
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId)!.add(socket.id);

    socket.on("disconnect", () => {
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });

  return io;
}

export function getIO(): Server | null {
  return io;
}

export function emitToUser(userId: string, event: string, data: unknown): void {
  if (!io) return;

  const sockets = userSockets.get(userId);
  if (sockets) {
    for (const socketId of sockets) {
      io.to(socketId).emit(event, data);
    }
  }
}

export function emitToAll(event: string, data: unknown): void {
  if (!io) return;
  io.emit(event, data);
}
