import mongoose from "mongoose";

let connectionPromise;
let listenersRegistered = false;

const connectDB = async () => {
  try {
    if (!listenersRegistered) {
      mongoose.connection.on("disconnected", () => {
        connectionPromise = undefined;
        console.warn("MongoDB disconnected");
      });

      mongoose.connection.on("error", (error) => {
        console.error("MongoDB error:", error.message);
      });

      listenersRegistered = true;
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (connectionPromise) {
      return connectionPromise;
    }

    const mongoUri = process.env.MONGO_URI?.trim().replace(/^['"]|['"]$/g, "");

    if (!mongoUri) {
      throw new Error("MONGO_URI is not set in .env");
    }

    if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
      throw new Error('MONGO_URI must start with "mongodb://" or "mongodb+srv://"');
    }

    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    await connectionPromise;

    console.log("MongoDB Connected");
    return mongoose.connection;

  } catch (error) {

    connectionPromise = undefined;
    throw error;
  }
};

export default connectDB;
