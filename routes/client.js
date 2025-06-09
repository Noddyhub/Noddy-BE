import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.get("/client-id", (req, res) => {
  const clientId = uuidv4();
  res.json({ clientId });
});

export default router;
