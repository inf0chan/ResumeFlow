const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'b901d9d2e96f4e9a1e4c5b3d2f1e0d9c8b7a6f5e4d3c2b1a0e9d8c7b6a5e4d3c';

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing auth token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth, JWT_SECRET };
