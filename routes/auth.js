import express from "express";
import axios from "axios";
import { generateJWT } from "../utils/jwt.js";

const router = express.Router();

router.get("/google", (req, res) => {
  try {
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

    console.log("[OAuth] 최종 redirect URL:", redirect_uri);
    res.redirect(redirect_uri);
    console.log("[OAuth] Google 인증 페이지로 리다이렉트 완료");
  } catch (err) {
    console.error("[OAuth] redirect_uri 생성 중 에러 발생:", err);
    res.status(500).send("OAuth URL 생성 실패");
  }
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
    console.log("Confirm id_token: ", id_token);

    const userInfo = await axios.get(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name, sub: googleId, locale } = userInfo.data;
    console.log(Object.keys(userInfo.data));

    const token = generateJWT({ email, name, googleId, locale });

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (err) {
    console.error("❌ OAuth Error:", err.response?.data || err.message);
    res.status(500).send("Authentication failed");
  }
});

export default router;
