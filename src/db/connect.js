import mongoose from "mongoose";
import config from "config";
import log from "../logger/index.js";
import dotenv from "dotenv";

dotenv.config();

export async function connect() {
  const dbUri = process.env.DB_URI;
  mongoose.set("strictQuery", true);
  const db = await mongoose.connect(dbUri);
  log.info("Database Connected !");
  return db;
}

export default connect;