const FORBIDDEN_KEY = /^\$|\./;

// Strips Mongo operator keys ($-prefixed) and dotted keys from req.body / req.query
// to prevent NoSQL operator injection. Purely in-place, preserves other values.
const sanitizeObject = (value, depth = 0) => {
  if (depth > 10) return undefined;
  if (Array.isArray(value)) {
    value.forEach((item) => sanitizeObject(item, depth + 1));
    return value;
  }
  if (value === null || typeof value !== 'object') return value;

  Object.keys(value).forEach((key) => {
    if (FORBIDDEN_KEY.test(key)) {
      delete value[key];
      return;
    }
    const result = sanitizeObject(value[key], depth + 1);
    if (result === undefined) {
      delete value[key];
    } else {
      value[key] = result;
    }
  });

  return value;
};

export const mongoSanitize = (req, res, next) => {
  try {
    sanitizeObject(req.body);
    sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
  } catch (error) {
    return next(error);
  }
  next();
};

export default mongoSanitize;