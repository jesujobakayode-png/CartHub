import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI?.trim().replace(/^['"]|['"]$/g, "");

    if (!mongoUri) {
      throw new Error("MONGO_URI is not set in .env");
    }

    if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
      throw new Error('MONGO_URI must start with "mongodb://" or "mongodb+srv://"');
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected");

  } catch (error) {

    console.error("MongoDB connection failed:", error.message);

    process.exit(1);
  }
};

export default connectDB;
