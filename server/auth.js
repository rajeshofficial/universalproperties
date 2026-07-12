import jwt from "jsonwebtoken";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

function jwtSecret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  return value;
}

export function createAdminToken(username) {
  return jwt.sign({ sub: username, role: "admin" }, jwtSecret(), { expiresIn: "8h" });
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  try {
    const payload = jwt.verify(token, jwtSecret());
    if (payload.role !== "admin") throw new Error("Invalid role");
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Admin authentication required" });
  }
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return { salt, passwordHash: derivedKey.toString("hex") };
}

export async function verifyPassword(password, salt, storedHash) {
  if (!password || !salt || !storedHash) return false;
  const derivedKey = await scrypt(password, salt, 64);
  const stored = Buffer.from(storedHash, "hex");
  return stored.length === derivedKey.length && timingSafeEqual(stored, derivedKey);
}
