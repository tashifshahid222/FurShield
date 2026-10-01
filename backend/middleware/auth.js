import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
<<<<<<< HEAD
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
=======
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
<<<<<<< HEAD
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Populates req.user when a valid token is present but never rejects the request.
// Used on endpoints that are public but return extra data to their owner.
export const optionalProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await User.findById(decoded.id);
    if (user && user.status !== 'inactive') {
      req.user = user;
    }
  } catch (error) {
    req.user = undefined;
  }

  next();
};

=======
    return res.status(401).json({ success: false, message: 'Not authorized to access this route', error: error.message });
  }
};

>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};