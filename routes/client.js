import express from "express";
import UserToken from "../models/token.js";

const router = express.Router();

router.post("/token", async (req, res) => {
  const { callbackId, token, name, email } = req.body;
  console.log("post callbackId:", callbackId, token);

  if (!callbackId || !token || !name || !email) {
    return res.status(400).json({ error: "callbackID or token이 없습니다." });
  }

  try {
    const savedToken = await UserToken.create({
      callbackId,
      token,
      name,
      email,
    });
    console.log("토큰 저장 완료", savedToken);

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("토큰 저장 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

router.get("/token/:callbackId", async (req, res) => {
  const { callbackId } = req.params;
  console.log("Confirm callbackId:", callbackId);

  try {
    const tokenDoc = await UserToken.findOneAndDelete({ callbackId });

    if (!tokenDoc) {
      return res.status(404).json({ error: "Token이 없습니다." });
    }

    return res.json({
      token: tokenDoc.token,
      name: tokenDoc.name,
      email: tokenDoc.email,
    });
  } catch (err) {
    console.error("토큰 조회 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
