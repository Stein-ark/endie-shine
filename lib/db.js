import mongoose from "mongoose";

// We use a global variable to cache the connection across hot reloads in development.

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If we already have a connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection exists yet, create one
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, options)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });
  }

  // Wait for the connection to finish and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;