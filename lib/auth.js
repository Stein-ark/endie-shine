import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// PASSWORD HASHING

export async function hashPassword(password) {
 
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}


export async function comparePassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// ─────────────────────────────────────────
// JSON WEB TOKENS
// ─────────────────────────────────────────


export function signToken(payload) {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
}


export function verifyToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

// ─────────────────────────────────────────
// COOKIE OPTIONS
// ─────────────────────────────────────────

export const cookieOptions = {
  httpOnly: true,   
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", 
  maxAge: 7 * 24 * 60 * 60 * 1000, 
  path: "/", 
};