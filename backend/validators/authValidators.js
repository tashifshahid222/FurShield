import { body } from 'express-validator';

export const registerValidators = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email')
    .bail()
    .normalizeEmail({ gmail_remove_dots: false })
    .customSanitizer((value) => (typeof value === 'string' ? value.toLowerCase() : value)),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .bail()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .bail()
    .isLength({ max: 30 })
    .withMessage('Phone cannot exceed 30 characters'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .bail()
    .isIn(['owner', 'veterinarian', 'shelter'])
    .withMessage('Invalid role'),
];

export const loginValidators = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email')
    .bail()
    .normalizeEmail({ gmail_remove_dots: false })
    .customSanitizer((value) => (typeof value === 'string' ? value.toLowerCase() : value)),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .bail()
    .notEmpty()
    .withMessage('Password is required'),
];

export const passwordValidators = [
  body('currentPassword')
    .isString()
    .withMessage('Current password must be a string')
    .bail()
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isString()
    .withMessage('New password must be a string')
    .bail()
    .notEmpty()
    .withMessage('New password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];

export const profileValidators = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .bail()
    .isLength({ max: 30 })
    .withMessage('Phone cannot exceed 30 characters'),
  body('profileImage')
    .optional()
    .isString()
    .withMessage('Profile image must be a string')
    .bail()
    .isLength({ max: 300 })
    .withMessage('Profile image path is too long'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
];