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

// CORS 허용
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// REST API 라우터 등록
app.use("/api", clientRouter);
app.use("/auth", authRouter);

// HTTP + WebSocket 서버 생성
const server = http.createServer(app);
initWebSocket(server);

// 서버 실행
server.listen(port, () => {
  console.log(`🟢 서버가 ${port} 에서 실행 중`);
});
