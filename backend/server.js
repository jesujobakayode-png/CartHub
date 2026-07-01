import app from "./app.js";
import http from "http";
import connectDB from "./config/db.js";
import { initSocket } from "./utils/socket.js";

const PORT = process.env.PORT || 5000;

connectDB().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
  console.error("Server will keep running; database routes will retry the connection.");
});

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
