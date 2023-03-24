import mongoose, {Mongoose} from "mongoose";
import config from "config";
import log from "../logger";

export async function connect() {
  const dbUri = config.get("dbUri") as string;
  mongoose.set('strictQuery', true);
  const db = await mongoose.connect(dbUri);
  log.info("Database Connected !")
  return db;
}

export default connect