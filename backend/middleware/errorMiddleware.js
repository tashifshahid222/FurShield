import { AppError } from '../utils/AppError.js';

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error.message;
  let errors = [];

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors || [];
  }

  if (error.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with id ${error.value}`;
  }

  if (error.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map((val) => val.message).join(', ');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  // Never leak raw internal error messages for unexpected 500s in production.
  if (statusCode >= 500 && isProduction) {
    console.error('Unhandled server error:', error);
    statusCode = 500;
    message = 'Internal server error';
    errors = [];
  } else if (statusCode >= 500) {
    console.error('Server error:', error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length ? { errors } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  });
};