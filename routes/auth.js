import express from "express";
import axios from "axios";
import { generateJWT } from "../utils/jwt.js";

const router = express.Router();

router.get("/google", (req, res) => {
  console.log("[OAuth] /auth/google 요청 도착");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  console.log("[OAuth] clientId:", clientId);
  console.log("[OAuth] redirectUri:", redirectUri);
  const redirect_uri =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    }).toString();

  res.redirect(redirect_uri);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = tokenRes.data;

    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name, sub: googleId } = userInfo.data;

    const token = generateJWT({ email, name, googleId });

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (err) {
    console.error("❌ OAuth Error:", err.response?.data || err.message);
    res.status(500).send("Authentication failed");
  }
});

export default router;
