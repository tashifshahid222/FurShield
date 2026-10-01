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
<<<<<<< HEAD
import { upload, verifyImageUpload } from '../middleware/upload.js';
=======
import { upload } from '../middleware/upload.js';
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

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
<<<<<<< HEAD
router.post('/articles', upload.single('coverImage'), verifyImageUpload, createArticle);
router.put('/articles/:id', upload.single('coverImage'), verifyImageUpload, updateArticle);
=======
router.post('/articles', upload.single('coverImage'), createArticle);
router.put('/articles/:id', upload.single('coverImage'), updateArticle);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
router.delete('/articles/:id', deleteArticle);

router.post('/faqs', createFaq);
router.put('/faqs/:id', updateFaq);
router.delete('/faqs/:id', deleteFaq);

router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', deleteVideo);

export default router;