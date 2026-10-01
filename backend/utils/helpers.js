import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Notification from '../models/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../uploads');

export const sendNotification = async ({
  recipient,
  sender = null,
  type = 'system',
  title,
  message,
  link = '',
  referenceId = null,
}) => {
  try {
    await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link: link || '',
      referenceId: referenceId || null,
    });
  } catch (error) {
    console.error('Failed to send notification:', error.message);
  }
};

export const MAX_PAGINATION_LIMIT = 100;

export const paginate = (page = 1, limit = 20) => {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);

  const pageNum = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const limitNum =
    Number.isNaN(parsedLimit) || parsedLimit < 1
      ? 20
      : Math.min(parsedLimit, MAX_PAGINATION_LIMIT);

  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

export const escapeRegex = (str = '') => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Removes a stored upload given a public path like "/uploads/abc.jpg".
// Only paths that resolve inside the uploads directory are deleted.
export const removeUpload = async (publicPath) => {
  if (!publicPath || typeof publicPath !== 'string') return;
  if (!publicPath.startsWith('/uploads/')) return;
  if (publicPath.includes('..')) return;
  if (publicPath.startsWith('/uploads/seed-')) return;

  const filename = path.basename(publicPath);
  if (!filename || filename === path.sep) return;

  const target = path.join(UPLOADS_DIR, filename);
  const relative = path.relative(UPLOADS_DIR, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return;

  try {
    await fs.promises.unlink(target);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to remove upload:', error.message);
    }
  }
};

export const buildPaginationResult = (total, pageNum, limitNum, data) => {
  return {
    data,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};