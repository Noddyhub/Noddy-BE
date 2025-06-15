import express from "express";
import Token from "../models/token";

const router = express.Router();

const tokenStore = new Map();

router.post("/token", async (req, res) => {
  const { callbackId, token } = req.body;
  console.log("post callbackId:", callbackId, token);

  if (!callbackId || !token) {
    return res.status(400).json({ error: "callbackID or token이 없습니다." });
  }

  try {
    await Token.findOneAndUpdate(
      { callbackId },
      { token, createdAt: new Date() },
      { upsert: true }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("토큰 저장 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

router.get("/token/:callbackId", async (req, res) => {
  const { callbackId } = req.params;
  console.log("Confirm callbackId:", callbackId);

  try {
    const tokenDoc = await Token.findOneAndDelete({ callbackId });

    if (!tokenDoc) {
      return res.status(404).json({ error: "Token이 없습니다." });
    }

    return res.json({ token: tokenDoc.token });
  } catch (err) {
    console.error("토큰 조회 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
