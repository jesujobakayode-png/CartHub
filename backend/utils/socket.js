import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

function isVendorRole(role) {
  return role?.toLowerCase() === "vendor";
}

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
      const room = isVendorRole(user.role) ? `vendor_${user.id}` : `user_${user.id}`;
      socket.join(room);
    }

    socket.on("join", ({ userId, role, target }) => {
      if (!userId || !role) return;
      if (isVendorRole(role) && !isVendorRole(socket.data.user.role)) {
        // Reject non-vendors from joining vendor rooms
        return;
      }

      const room = isVendorRole(role) ? `vendor_${userId}` : `user_${userId}`;
      socket.join(room);
    });

    socket.on("leave", ({ userId, role }) => {
      if (!userId || !role) return;
      if (isVendorRole(role) && !isVendorRole(socket.data.user.role)) {
        return;
      }

      const room = isVendorRole(role) ? `vendor_${userId}` : `user_${userId}`;
      socket.leave(room);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIo = () => io;
