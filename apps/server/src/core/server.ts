import dotenv from "dotenv";
import mongoose from "mongoose";
import { loadConfig } from "../config/env";
import { createApp } from "./app";

dotenv.config();

const config = loadConfig();

async function start() {
  await mongoose.connect(config.mongodbUri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");

  const app = createApp();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${config.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error", err);
  process.exit(1);
});
