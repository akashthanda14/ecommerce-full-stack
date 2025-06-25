// middlewares/authUser.js
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ Proper way
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authUser;
