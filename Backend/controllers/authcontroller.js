console.log("AUTH CONTROLLER LOADED");

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } = require('../utils/tokenutil');
const ms = require('ms'); // optional; if not installed, compute expiry manually

const ACCESS_COOKIE_NAME = 'refreshToken'; // cookie stores refresh token (HttpOnly)

const REFRESH_EXPIRES_MS = (() => {
  // parse REFRESH_TOKEN_EXPIRES_IN like '30d' or fallback to 30 days
  const v = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
  const num = parseInt(v);
  if (v.endsWith('d')) return num * 24 * 60 * 60 * 1000;
  if (v.endsWith('h')) return num * 60 * 60 * 1000;
  return 30 * 24 * 60 * 60 * 1000;
})();

async function signup(req, res) {
  try {
    const { name, email, password, phone } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = new User({ name, email, passwordHash, phone });
    await user.save();

    // do not auto-login: we'll return minimal data; or create tokens immediately:
    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id });
    const rtHash = hashToken(refreshToken);
    await RefreshToken.create({ user: user._id, tokenHash: rtHash, expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS) });

    // set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAMESITE || 'Strict',
      maxAge: REFRESH_EXPIRES_MS
    };
    res.cookie(ACCESS_COOKIE_NAME, refreshToken, cookieOptions);
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id });

    const rtHash = hashToken(refreshToken);
    // Optionally, revoke existing tokens for this user or keep multiple allowed.
    await RefreshToken.create({ user: user._id, tokenHash: rtHash, expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS) });

    res.cookie(ACCESS_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAMESITE || 'Strict',
      maxAge: REFRESH_EXPIRES_MS
    });
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function refreshTokenHandler(req, res) {
  try {
    const token = req.cookies[ACCESS_COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    // verify token signature
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const tokenHash = hashToken(token);

    // find token record
    const tokenDoc = await RefreshToken.findOne({ tokenHash, revoked: false });
    if (!tokenDoc) return res.status(401).json({ message: 'Refresh token not found or revoked' });

    // optional: check expiry
    if (new Date() > tokenDoc.expiresAt) return res.status(401).json({ message: 'Refresh token expired' });

    const userId = payload.sub;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // rotate refresh token: issue new refresh token and revoke old
    const newRefreshToken = signRefreshToken({ sub: user._id });
    const newHash = hashToken(newRefreshToken);

    tokenDoc.revoked = true;
    tokenDoc.replacedByToken = newHash;
    await tokenDoc.save();

    await RefreshToken.create({ user: user._id, tokenHash: newHash, expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS) });

    const accessToken = signAccessToken({ sub: user._id, role: user.role });

    // set cookie
    res.cookie(ACCESS_COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAMESITE || 'Strict',
      maxAge: REFRESH_EXPIRES_MS
    });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies[ACCESS_COOKIE_NAME];
    if (token) {
      const tHash = hashToken(token);
      await RefreshToken.findOneAndUpdate({ tokenHash: tHash }, { revoked: true });
    }
    // clear cookie
    res.clearCookie(ACCESS_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAMESITE || 'Strict',
    });
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function me(req, res) {
  // req.user expected to be filled by requireAuth middleware
  if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
  const user = await User.findById(req.user.sub).select('-passwordHash');
  res.json({ user });
}

module.exports = { signup, login, refreshTokenHandler, logout, me };
