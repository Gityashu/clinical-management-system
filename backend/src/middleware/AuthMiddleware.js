const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: '❌ No authorization header provided',
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: '❌ Invalid token format. Use: Bearer <token>',
      });
    }

    const token = parts;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '❌ Invalid or expired token',
      error: error.message,
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '❌ Access denied. Admin privileges required.',
    });
  }
  next();
};

const doctorMiddleware = (req, res, next) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '❌ Access denied. Doctor privileges required.',
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, doctorMiddleware };

