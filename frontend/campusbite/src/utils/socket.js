import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;
const rawBaseURL = apiUrl
  ? apiUrl.replace(/\/api\/?$/, "")
  : import.meta.env.PROD
  ? "https://campusbite-ylzz.onrender.com"
  : "http://localhost:5000";

const normalized = rawBaseURL.replace(/\/$/, "");

const socket = io(normalized, {
  autoConnect: false,
  // allow polling fallback for environments where websocket handshake may fail
  transports: ["websocket", "polling"],
});

const isDev = import.meta.env.DEV;

if (isDev && typeof window !== "undefined") {
  window.__appSocket = socket;
  window.__socketLogs = [];
}

const captureSocketLog = (level, message, value) => {
  if (isDev && typeof window !== "undefined" && Array.isArray(window.__socketLogs)) {
    window.__socketLogs.push({ level, message, value, timestamp: new Date().toISOString() });
  }
};

socket.on("connect", () => {
  captureSocketLog("info", "Socket connected", { id: socket.id, url: normalized });
  if (isDev) {
    console.log("Socket connected", { id: socket.id, url: normalized });
  }
});

socket.on("disconnect", (reason) => {
  captureSocketLog("warn", "Socket disconnected", reason);
  if (isDev) {
    console.warn("Socket disconnected", reason);
  }
});

socket.on("reconnect_attempt", (attempt) => {
  captureSocketLog("info", "Socket reconnect attempt", attempt);
  if (isDev) {
    console.log("Socket reconnect attempt", attempt);
  }
});

socket.on("connect_error", (err) => {
  captureSocketLog("error", "Socket connect_error", err?.message || err);
  if (isDev) {
    console.warn("Socket connect_error:", err?.message || err, err);
  }
});

export const connectSocket = (token) => {
  return new Promise((resolve, reject) => {
    try {
      if (token) {
        socket.auth = { token };
      } else {
        const stored = localStorage.getItem("token");
        if (stored) socket.auth = { token: stored };
      }
      
      if (socket.connected) {
        resolve();
        return;
      }
      
      socket.once("connect", () => resolve());
      socket.once("connect_error", (err) => reject(err || new Error("Connection failed")));
      socket.connect();
    } catch (e) {
      if (isDev) {
        console.warn("Socket connect failed", e);
      }
      reject(e);
    }
  });
};

export const disconnectSocket = () => {
  try {
    socket.disconnect();
  } catch {
    if (isDev) {
      console.warn("Socket disconnect failed");
    }
  }
};

export const joinRoom = async ({ userId, role }) => {
  if (!userId) return;
  try {
    await connectSocket();
    socket.emit("join", { userId, role });
  } catch (e) {
    if (isDev) {
      console.warn("Room join failed", e);
    }
  }
};

export const leaveRoom = ({ userId, role }) => {
  if (!userId) return;
  socket.emit("leave", { userId, role });
};

export const onEvent = (event, cb) => socket.on(event, cb);
export const offEvent = (event, cb) => socket.off(event, cb);

export default socket;
