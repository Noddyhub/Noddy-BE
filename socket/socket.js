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
    const messageObj = JSON.parse(message.toString());
    const { name, newValue } = messageObj;
    const value = parseInt(newValue, 10);

    if (!isNaN(userNum)) {
      const data = JSON.stringify({ type: "number", name, value });
      ws.send(data);
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    } else {
      ws.send(JSON.stringify({ type: "error", message: "숫자를 입력하세요" }))
    }
  });

  ws.send("서버에 연결되었습니다!");
});

server.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중`);
});
