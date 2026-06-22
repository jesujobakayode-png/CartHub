import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // JWT auth for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    if (!process.env.JWT_SECRET) {
      return next(new Error("Server JWT not configured"));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.user = { id: payload.id, role: payload.role };
      return next();
    } catch (err) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data?.user;

    if (user && user.id) {
      const room = user.role === "vendor" ? `vendor_${user.id}` : `user_${user.id}`;
      socket.join(room);
    }

    socket.on("join", ({ userId, role, target }) => {
      if (!userId || !role) return;
      if (role === "vendor" && socket.data.user.role !== "vendor") {
        // Reject non-vendors from joining vendor rooms
        return;
      }

      const room = role === "vendor" ? `vendor_${userId}` : `user_${userId}`;
      socket.join(room);
    });

    socket.on("leave", ({ userId, role }) => {
      if (!userId || !role) return;
      if (role === "vendor" && socket.data.user.role !== "vendor") {
        return;
      }

      const room = role === "vendor" ? `vendor_${userId}` : `user_${userId}`;
      socket.leave(room);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIo = () => io;
