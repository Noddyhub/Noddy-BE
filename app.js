import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import clientRouter from "./routes/client.js";
import authRouter from "./routes/auth.js";
import { initWebSocket } from "./socket/socket.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = 8080;

app.use(
  cors({
    origin: process.env.FRONTEND_UR,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", clientRouter);
app.use("/auth", authRouter);

const server = http.createServer(app);
initWebSocket(server);

server.listen(port, () => {
  console.log(`🟢 서버가 ${port} 에서 실행 중`);
});
