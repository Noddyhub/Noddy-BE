import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import clientRouter from "./routes/client.js";
import authRouter from "./routes/auth.js";
import { connectMongoDB } from "./config/db.js";
import { initWebSocket } from "./socket/socket.js";
import { PORT } from "./constants/constants.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", clientRouter);
app.use("/auth", authRouter);

const startServer = async () => {
  await connectMongoDB();
  const server = http.createServer(app);
  initWebSocket(server);
  server.listen(PORT, () => {
    console.log(`서버 실행 중`);
  });
};

startServer();
