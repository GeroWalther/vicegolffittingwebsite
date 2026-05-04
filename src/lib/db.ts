import mongoose from "mongoose";

declare global {
  var __mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cached =
  global.__mongoose ?? (global.__mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI env var is not set");
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
