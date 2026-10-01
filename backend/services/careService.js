import CareArticle from '../models/CareArticle.js';
import Faq from '../models/Faq.js';
import Video from '../models/Video.js';
<<<<<<< HEAD
import { paginate, buildPaginationResult, escapeRegex } from '../utils/helpers.js';
=======
import { paginate, buildPaginationResult } from '../utils/helpers.js';
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
import { AppError } from '../utils/AppError.js';

const isAdmin = (actor) => {
  if (actor?.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }
};

export const listArticles = async ({ page, limit, search, category, isPublic, includeDrafts, featured }) => {
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = {};
  if (isPublic || !includeDrafts) query.status = 'published';
  if (featured === 'true' || featured === true) query.featured = true;
  if (category) query.category = category;
  if (search) {
    query.$or = [
<<<<<<< HEAD
      { title: { $regex: escapeRegex(search), $options: 'i' } },
      { content: { $regex: escapeRegex(search), $options: 'i' } },
      { tags: { $in: [new RegExp(escapeRegex(search), 'i')] } },
=======
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
    ];
  }

  const total = await CareArticle.countDocuments(query);
  const articles = await CareArticle.find(query)
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return { ...buildPaginationResult(total, pageNum, limitNum, articles) };
};

export const getArticleById = async (id) => {
  const article = await CareArticle.findById(id).populate('author', 'name');
  if (!article) throw new AppError('Article not found', 404);
  article.viewCount += 1;
  await article.save();
  return article;
};

export const createArticle = async ({ actor, body, file }) => {
  isAdmin(actor);
  const { title, category, content, summary, tags, status, featured } = body;
  if (!title || !category || !content) {
    throw new AppError('Title, category and content are required', 400);
  }
  return CareArticle.create({
    title,
    category,
    content,
    summary: summary || '',
    coverImage: file ? `/uploads/${file.filename}` : (body.coverImage || ''),
    author: actor._id,
    tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
    status: status || 'published',
    featured: featured === true || featured === 'true' || featured === '1',
  });
};

export const updateArticle = async ({ id, actor, body, file }) => {
  isAdmin(actor);
  const article = await CareArticle.findById(id);
  if (!article) throw new AppError('Article not found', 404);

  const allowedFields = ['title', 'category', 'content', 'summary', 'tags', 'status', 'featured'];
  const updateData = {};
  allowedFields.forEach((f) => {
    if (body[f] !== undefined) updateData[f] = f === 'featured' ? (body[f] === true || body[f] === 'true' || body[f] === '1') : body[f];
  });
  if (body.tags && typeof body.tags === 'string') {
    updateData.tags = body.tags.split(',').map((t) => t.trim());
  }
  if (file) updateData.coverImage = `/uploads/${file.filename}`;

  return CareArticle.findByIdAndUpdate(article._id, updateData, { new: true, runValidators: true });
};

export const removeArticle = async ({ id, actor }) => {
  isAdmin(actor);
  const article = await CareArticle.findById(id);
  if (!article) throw new AppError('Article not found', 404);
  await article.deleteOne();
  return article;
};

export const listFaqs = async ({ search, category, includeInactive = false }) => {
  const query = includeInactive ? {} : { status: 'active' };
  if (category) query.category = category;
  if (search) {
    query.$or = [
<<<<<<< HEAD
      { question: { $regex: escapeRegex(search), $options: 'i' } },
      { answer: { $regex: escapeRegex(search), $options: 'i' } },
=======
      { question: { $regex: search, $options: 'i' } },
      { answer: { $regex: search, $options: 'i' } },
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
    ];
  }
  return Faq.find(query).sort({ order: 1, createdAt: -1 });
};

export const createFaq = async ({ actor, body }) => {
  isAdmin(actor);
  const { question, answer, category, status, order } = body;
  if (!question || !answer) {
    throw new AppError('Question and answer are required', 400);
  }
  return Faq.create({
    question,
    answer,
    category: category || 'general',
    status: status || 'active',
    order: order || 0,
  });
};

export const updateFaq = async ({ id, actor, body }) => {
  isAdmin(actor);
  const faq = await Faq.findById(id);
  if (!faq) throw new AppError('FAQ not found', 404);

  const allowedFields = ['question', 'answer', 'category', 'status', 'order'];
  const updateData = {};
  allowedFields.forEach((f) => {
    if (body[f] !== undefined) updateData[f] = body[f];
  });

  return Faq.findByIdAndUpdate(faq._id, updateData, { new: true, runValidators: true });
};

export const removeFaq = async ({ id, actor }) => {
  isAdmin(actor);
  const faq = await Faq.findById(id);
  if (!faq) throw new AppError('FAQ not found', 404);
  await faq.deleteOne();
  return faq;
};

export const listVideos = async ({ page, limit, search, category, isPublic, includeInactive }) => {
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = {};
  if (isPublic || !includeInactive) query.status = 'active';
  if (category) query.category = category;
  if (search) {
    query.$or = [
<<<<<<< HEAD
      { title: { $regex: escapeRegex(search), $options: 'i' } },
      { description: { $regex: escapeRegex(search), $options: 'i' } },
=======
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
    ];
  }

  const total = await Video.countDocuments(query);
  const videos = await Video.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return { ...buildPaginationResult(total, pageNum, limitNum, videos) };
};

export const getVideoById = async (id) => {
  const video = await Video.findById(id);
  if (!video) throw new AppError('Video not found', 404);
  video.viewCount += 1;
  await video.save();
  return video;
};

const normalizeVideoUrl = (url) => {
  if (!url) return url;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : String(url);
};

export const createVideo = async ({ actor, body }) => {
  isAdmin(actor);
  const { title, description, category, url, duration, status } = body;
  if (!title || !url) {
    throw new AppError('Title and URL are required', 400);
  }
  return Video.create({
    title,
    description: description || '',
    category: category || 'general',
    url: normalizeVideoUrl(url),
    duration: duration || 0,
    status: status || 'active',
  });
};

export const updateVideo = async ({ id, actor, body }) => {
  isAdmin(actor);
  const video = await Video.findById(id);
  if (!video) throw new AppError('Video not found', 404);

  const allowedFields = ['title', 'description', 'category', 'url', 'duration', 'status'];
  const updateData = {};
  allowedFields.forEach((f) => {
    if (body[f] !== undefined) updateData[f] = body[f];
  });
  if (updateData.url) updateData.url = normalizeVideoUrl(updateData.url);

  return Video.findByIdAndUpdate(video._id, updateData, { new: true, runValidators: true });
};

export const removeVideo = async ({ id, actor }) => {
  isAdmin(actor);
  const video = await Video.findById(id);
  if (!video) throw new AppError('Video not found', 404);
  await video.deleteOne();
  return video;
};