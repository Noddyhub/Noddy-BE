import { WebSocketServer } from "ws";

const clientMap = new Map();

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log("🟢 클라이언트 연결됨:", req.socket.remoteAddress);

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        const { type, clientId } = message;
        // console.log(type === "register-swift" ? `${clientId} ${message.pitch} ${message.yaw}` : "nothing");
        // console.log(type === "type" ? `${clientId} ${message.pitch} ${message.yaw}` : "nothing");

        if (!clientId) return;

        if (!clientMap.has(clientId)) {
          clientMap.set(clientId, {});
        }

        const pair = clientMap.get(clientId);

        switch (type) {
          case "register-react":
            pair.react = ws;
            console.log("✅ React 연결됨:", clientId);
            break;

          case "register-swift":
            pair.swift = ws;
            console.log("✅ Swift 연결됨:", clientId);
            break;

          case "motion":
            if (pair.react) {
              pair.react.send(JSON.stringify({
                type: "motion",
                pitch: message.pitch,
                yaw: message.yaw,
                name: message.name,
                macBattery: message.macBattery,
                airpodLeftBattery: message.airpodLeftBattery,
                airpodRightBattery: message.airpodRightBattery
              }));
            }
            break;

          case "control":
            if (pair.swift) {
              pair.swift.send(JSON.stringify({
                type: "control",
                name: message.name,
                value: message.value
              }));
            }
            break;

          case "hotkey":
            if (pair.swift) {
              pair.swift.send(JSON.stringify({
                type: "hotkey",
                name: message.name,
                value: message.value
              }));
            }
            break;

          default:
            console.warn("⚠️ 알 수 없는 타입:", type);
        }

      } catch (err) {
        console.error("❌ 메시지 처리 오류:", err.message);
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.send("서버에 연결되었습니다!");
  });
}
