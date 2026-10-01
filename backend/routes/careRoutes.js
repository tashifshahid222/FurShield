import express from 'express';
import {
  getArticles,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getFaqs,
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/careController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, verifyImageUpload } from '../middleware/upload.js';

const router = express.Router();

router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);
router.get('/faqs', getFaqs);
router.get('/videos', getVideos);
router.get('/videos/:id', getVideoById);

router.use(protect);
router.use(authorize('admin'));

router.get('/faqs/manage', getAllFaqs);
router.get('/articles/manage/all', getAllArticles);
router.post('/articles', upload.single('coverImage'), verifyImageUpload, createArticle);
router.put('/articles/:id', upload.single('coverImage'), verifyImageUpload, updateArticle);
router.delete('/articles/:id', deleteArticle);

router.post('/faqs', createFaq);
router.put('/faqs/:id', updateFaq);
router.delete('/faqs/:id', deleteFaq);

router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', deleteVideo);

export default router;