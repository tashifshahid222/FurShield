import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppError } from '../utils/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../uploads');

const IMAGE_MIME_EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/pjpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const DOCUMENT_MIME_EXTENSIONS = {
  ...IMAGE_MIME_EXTENSIONS,
  'application/pdf': '.pdf',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // The stored extension is derived from the validated mimetype, never the
    // client-supplied filename, so a crafted name cannot change the file type.
    const ext = file.mimetypeExt || '';
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const makeFileFilter = (allowedMap, message) => (req, file, cb) => {
  const mimetype = (file.mimetype || '').toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(allowedMap, mimetype)) {
    return cb(new AppError(message, 400));
  }

  file.mimetypeExt = allowedMap[mimetype];
  return cb(null, true);
};

const imageFilter = makeFileFilter(IMAGE_MIME_EXTENSIONS, 'Only JPEG, PNG, GIF or WEBP images are allowed');
const documentFilter = makeFileFilter(DOCUMENT_MIME_EXTENSIONS, 'Only PDF or image files are allowed');

// Verifies a file's real type from its magic bytes and removes it when the
// content does not match the declared mimetype.
export const verifyFileType = async (file, allowedMap) => {
  if (!file || !file.path) return { valid: true };

  let handle;
  try {
    handle = await fs.promises.open(file.path, 'r');
    const buffer = Buffer.alloc(12);
    const { bytesRead } = await handle.read(buffer, 0, 12, 0);
    if (bytesRead < 4) {
      return { valid: false };
    }

    const detected = detectImageMime(buffer);
    if (!detected) return { valid: false };

    if (!Object.prototype.hasOwnProperty.call(allowedMap, detected)) return { valid: false };

    const expected = file.mimetypeExt;
    const expectedMime = Object.keys(allowedMap).find((m) => allowedMap[m] === expected);
    if (expectedMime && expectedMime !== detected && detected !== 'image/pjpeg' && expectedMime !== 'image/jpeg') {
      return { valid: false };
    }

    return { valid: true, detected };
  } catch (error) {
    return { valid: false };
  } finally {
    if (handle) {
      try {
        await handle.close();
      } catch (closeError) {
        console.error('Failed to close uploaded file handle:', closeError.message);
      }
    }
  }
};

const detectImageMime = (buffer) => {
  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (buffer.length >= 6) {
    const header = buffer.toString('ascii', 0, 6);
    if (header === 'GIF87a' || header === 'GIF89a') return 'image/gif';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  if (buffer.toString('ascii', 0, 5) === '%PDF-') return 'application/pdf';

  return null;
};

// Express middleware wrapper that deletes files failing the magic-byte check.
export const verifyUploadedFiles = (allowedMap) => async (req, res, next) => {
  const files = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) files.push(...req.files);
  else if (req.files && typeof req.files === 'object') files.push(...Object.values(req.files));

  for (const file of files) {
    const { valid } = await verifyFileType(file, allowedMap);
    if (!valid) {
      try {
        await fs.promises.unlink(file.path);
      } catch (unlinkError) {
        if (unlinkError.code !== 'ENOENT') {
          console.error('Failed to remove rejected upload:', unlinkError.message);
        }
      }
      if (req.file) delete req.file;
      if (req.files) delete req.files;
      return res.status(400).json({
        success: false,
        message: 'The uploaded file type does not match its contents',
      });
    }
  }

  next();
};

export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadDocuments = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const verifyImageUpload = verifyUploadedFiles(IMAGE_MIME_EXTENSIONS);
export const verifyDocumentUpload = verifyUploadedFiles(DOCUMENT_MIME_EXTENSIONS);
