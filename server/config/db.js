import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment");
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME || undefined,
  });

  console.log("MongoDB connected");
}
