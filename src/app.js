import express from "express";
import log from "./logger/index.js";
import connect from "./db/connect.js";
import cors from "cors";
import morgan from "morgan";
import router from "./router.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST;
// An App
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

// Router
app.use("/api", router);
app.listen(port, host, () => {
  log.info(`Server is Listening at http://${host}:${port}`);
  connect();
});