import express from "express";

const router = express.Router();

const tokenStore = new Map();

router.post("/token", (res, req) => {
  const { callbackId, token } = req.body;

  if (!callbackId || !token) {
    return res.status(400).json({ error: "callbackID or token이 없습니다."});
  }

  tokenStore.set(callbackId, token);

  return res.json({ success: true });
});

router.get("/token/:callbackId", (req, res) => {
  const { callbackId } = req.params;

  if (!tokenStore.has(callbackId)) {
    return res.status(404).json({ error: "Token이 없습니다." });
  }

  const token = tokenStore.get(callbackId);
  tokenStore.delete(callbackId);

  return res.json({ token });
});

export default router;
