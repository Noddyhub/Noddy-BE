import express from "express";
import UserSettings from "../models/userSettings.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, key, value } = req.body;

  if (!email || !key) {
    return res.status(400).json({ error: "email과 key는 필수입니다." });
  }

  try {
    const saved = await UserSettings.findOneAndUpdate(
      { email, key },
      { value },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, setting: saved });
  } catch (err) {
    console.error("설정 저장 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

router.get("/", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "email 쿼리 파라미터가 필요합니다." });
  }

  try {
    const settings = await UserSettings.find({ email });
    const result = {};

    settings.forEach(({ key, value }) => {
      result[key] = value;
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("설정 조회 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
