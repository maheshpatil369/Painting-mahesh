const { verifyAccessToken } = require('../utils/tokenutil');

function requireAuth(req, res, next) {
  // First check Authorization header for access token
  const authHeader = req.headers.authorization || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { sub: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden — insufficient privileges' });
    next();
  };
}

module.exports = { requireAuth, requireRole };