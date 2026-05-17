import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function ensureJwtSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");
}

function signAccessToken(user) {
  ensureJwtSecret();
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
}

function signRefreshToken(user) {
  ensureJwtSecret();
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
}

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (e) {
    next(e);
  }
}

// POST /api/auth/refresh
export function refresh(req, res) {
  try {
    ensureJwtSecret();

    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const accessToken = jwt.sign(
      { sub: payload.sub, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
    );

    return res.json({ accessToken });
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}
