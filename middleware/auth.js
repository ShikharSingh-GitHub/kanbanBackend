const admin = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: no token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message || error);
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
};

module.exports = verifyToken;
