import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("WebSocket 서버 실행 중");
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  console.log("🟢 클라이언트 연결됨:", req.socket.remoteAddress);

  ws.on("message", (message) => {
    try {
      const messageObj = JSON.parse(message.toString());
      const { name, sliderValue } = messageObj;
      const value = parseInt(sliderValue, 10);

      if (isNaN(value)) {
        throw new Error("sliderValue는 숫자가 아닙니다.");
      }

      const data = JSON.stringify({ type: "number", name, value });
      ws.send(data);

      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });

    } catch (err) {
      console.error("❌ 메시지 처리 오류:", err.message);
      ws.send(JSON.stringify({ type: "error", message: err.message }));
    }
  });

  ws.send("서버에 연결되었습니다!");
});

server.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중`);
});
