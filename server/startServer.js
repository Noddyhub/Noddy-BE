import http from "http";
import { connectMongoDB } from "../config/mongo.js";
import { initWebSocket } from "../socket/socket.js";
import app from "../app.js";
import { PORT } from "../constants/constants.js";

export const startServer = async () => {
  await connectMongoDB();
  const server = http.createServer(app);
  initWebSocket(server);
  server.listen(PORT, () => {
    console.log(`🟢 서버가 ${PORT} 에서 실행 중`);
  });
};
