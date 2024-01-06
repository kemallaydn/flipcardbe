import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";

import "dotenv/config";
import router from "./router";
import connectToMongo from "./database";
import AuthMiddleware from "./middlewares/authentication";
import LoggingMiddleware from "./middlewares/logging";
import Logger from "./utilities/Logger";

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(LoggingMiddleware);
app.use(AuthMiddleware);
app.use(router);
app.get("/health-check", (req, res) => res.send("OK"));

const server = createServer(app);
export const io = new Server(server);
io.on("connection", (socket) => {
  console.log("a user connectd");
});

server.listen(port, async () => {
  console.log(
    `Server listening to http://localhost:${port}, NODE_ENV=${process.env.NODE_ENV}`
  );
  await connectToMongo();
});
process.on("uncaughtException", (error) => {
  Logger.error("ROOT LEVEL ERROR " + error + " " + JSON.stringify(error));
});
