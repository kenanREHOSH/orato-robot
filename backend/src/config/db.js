import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Fixes ECONNREFUSED DNS resolution on some networks

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI not set. Using mock data for now.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    if (error.message.includes("bad auth")) {
      console.error("⚠️  Database authentication failed! Please check your username and password in the MONGO_URI inside `.env`.");
    }
    console.log("Continuing with mock data...");
  }
};

export default connectDB;