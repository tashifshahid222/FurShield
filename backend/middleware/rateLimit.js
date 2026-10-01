import rateLimit from 'express-rate-limit';

const jsonMessage = (message) => ({
  success: false,
  message,
});

const handler = (message) => (req, res) => {
  res.status(429).json(jsonMessage(message));
};

// General protection for the whole API surface.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: handler('Too many requests, please try again later.'),
});

// Strict limiter for credential endpoints to slow down brute force attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: handler('Too many attempts. Please try again in 15 minutes.'),
});

// Public, unauthenticated form: tighter still.
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: handler('Too many messages sent. Please try again later.'),
});