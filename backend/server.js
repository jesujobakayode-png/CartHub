import app from "./app.js";
import http from "http";
import connectDB from "./config/db.js";
import { initSocket } from "./utils/socket.js";

const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}
