import asyncHandler from '../middleware/asyncHandler.js';
import {
  listArticles,
  getArticleById as serviceGetArticleById,
  createArticle as serviceCreateArticle,
  updateArticle as serviceUpdateArticle,
  removeArticle,
  listFaqs,
  createFaq as serviceCreateFaq,
  updateFaq as serviceUpdateFaq,
  removeFaq,
  listVideos,
  getVideoById as serviceGetVideoById,
  createVideo as serviceCreateVideo,
  updateVideo as serviceUpdateVideo,
  removeVideo,
} from '../services/careService.js';

export const getArticles = asyncHandler(async (req, res) => {
  const result = await listArticles({
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    category: req.query.category,
    featured: req.query.featured,
    isPublic: req.query.public === 'true',
  });
  res.status(200).json({ success: true, ...result });
});

export const getAllArticles = asyncHandler(async (req, res) => {
  const result = await listArticles({
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    category: req.query.category,
    includeDrafts: true,
  });
  res.status(200).json({ success: true, ...result });
});

export const getArticleById = asyncHandler(async (req, res) => {
  const article = await serviceGetArticleById(req.params.id);
  res.status(200).json({ success: true, data: article });
});

export const createArticle = asyncHandler(async (req, res) => {
  const article = await serviceCreateArticle({ actor: req.user, body: req.body, file: req.file });
  res.status(201).json({ success: true, message: 'Article created', data: article });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const article = await serviceUpdateArticle({ id: req.params.id, actor: req.user, body: req.body, file: req.file });
  res.status(200).json({ success: true, message: 'Article updated', data: article });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  await removeArticle({ id: req.params.id, actor: req.user });
  res.status(200).json({ success: true, message: 'Article deleted' });
});

export const getFaqs = asyncHandler(async (req, res) => {
  const faqs = await listFaqs({
    search: req.query.search,
    category: req.query.category,
    includeInactive: !!req.query.includeInactive,
  });
  res.status(200).json({ success: true, data: faqs });
});

export const getAllFaqs = asyncHandler(async (req, res) => {
  const faqs = await listFaqs({ includeInactive: true });
  res.status(200).json({ success: true, data: faqs });
});

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await serviceCreateFaq({ actor: req.user, body: req.body });
  res.status(201).json({ success: true, message: 'FAQ created', data: faq });
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await serviceUpdateFaq({ id: req.params.id, actor: req.user, body: req.body });
  res.status(200).json({ success: true, message: 'FAQ updated', data: faq });
});

export const deleteFaq = asyncHandler(async (req, res) => {
  await removeFaq({ id: req.params.id, actor: req.user });
  res.status(200).json({ success: true, message: 'FAQ deleted' });
});

export const getVideos = asyncHandler(async (req, res) => {
  const result = await listVideos({
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    category: req.query.category,
    isPublic: req.query.public === 'true',
    includeInactive: !!req.query.includeInactive,
  });
  res.status(200).json({ success: true, ...result });
});

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await serviceGetVideoById(req.params.id);
  res.status(200).json({ success: true, data: video });
});

export const createVideo = asyncHandler(async (req, res) => {
  const video = await serviceCreateVideo({ actor: req.user, body: req.body, file: req.file });
  res.status(201).json({ success: true, message: 'Video created', data: video });
});

export const updateVideo = asyncHandler(async (req, res) => {
  const video = await serviceUpdateVideo({ id: req.params.id, actor: req.user, body: req.body, file: req.file });
  res.status(200).json({ success: true, message: 'Video updated', data: video });
});

export const deleteVideo = asyncHandler(async (req, res) => {
  await removeVideo({ id: req.params.id, actor: req.user });
  res.status(200).json({ success: true, message: 'Video deleted' });
});