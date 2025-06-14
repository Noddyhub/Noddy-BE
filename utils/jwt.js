import jwt from "jsonwebtoken";

export function generateJWT(payload) {
  console.log("userInfo payload: " + payload);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });
}

export function verify(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
