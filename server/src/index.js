import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import mongoose from "mongoose";

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        await mongoose.connection.close();
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${env.PORT} is already in use. Stop the other backend process or change PORT in server/.env.`,
        );
        process.exit(1);
      }

      console.error("Server failed", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
