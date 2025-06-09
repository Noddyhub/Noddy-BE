import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors());
app.get("/client-id", (req, res) => {
  const clientId = uuidv4();
  res.json({ clientId });
  res.send("WebSocket 서버 실행 중");
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clientMap = new Map();

wss.on("connection", (ws, req) => {
  console.log("🟢 클라이언트 연결됨:", req.socket.remoteAddress);

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      const { type, clientId } = message;

      if (!clientId) return;

      if (!clientMap.has(clientId)) {
        clientMap.set(clientId, {});
      }

      const pair = clientMap.get(clientId);

      if (type === "register-react") {
        pair.react = ws;
        console.log("✅ React 연결됨:", clientId);
      } else if (type === "register-swift") {
        pair.swift = ws;
        console.log("✅ Swift 연결됨:", clientId);
      }

      // motion (Swfit -> React)
      if (type === "motion" && pair.react) {
        pair.react.send(JSON.stringify({ type: "motion", pitch: message.pitch, yaw: message.yaw }));
      }

      // control (React -> Swift), cursor speed, cursor reaction speed, scroll speed
      if (type === "control" && pair.swift) {
        pair.swift.send(JSON.stringify({ type: "control", name: message.name, value: message.value }));
      }

      // control (React -> Swift), hotkey
      if (type === "hotkey" && pair.swift) {
        pair.swift.send(JSON.stringify({ type: "hotkey", name: message.name, value: message.value }));
      }

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
