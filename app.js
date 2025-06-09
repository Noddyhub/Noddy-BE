import express from "express";
import http from "http";
import cors from "cors";
import clientRouter from "./routes/client.js";
import { initWebSocket } from "./socket/socket.js";

const app = express();
const port = 8080;

// CORS 허용
app.use(cors());

// REST API 라우터 등록
app.use("/", clientRouter);

// HTTP + WebSocket 서버 생성
const server = http.createServer(app);
initWebSocket(server);

// 서버 실행
server.listen(port, () => {
  console.log(`🟢 서버가 http://localhost:${port} 에서 실행 중`);
});
