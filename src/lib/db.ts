import mongoose from "mongoose";

declare global {
  var __mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cached =
  global.__mongoose ?? (global.__mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  // If a previous connection became disconnected, drop it and reconnect.
  if (cached.conn && cached.conn.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI env var is not set");
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 30000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Critical: don't keep a rejected promise cached or every subsequent
    // request reuses it and 500s forever until the function restarts.
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
  return cached.conn;
}
