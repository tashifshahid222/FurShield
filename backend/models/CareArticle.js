import mongoose from 'mongoose';

const careArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['feeding', 'hygiene', 'exercise', 'grooming', 'vaccination', 'general'],
      required: [true, 'Article category is required'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    summary: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

careArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });
careArticleSchema.index({ category: 1 });

export default mongoose.model('CareArticle', careArticleSchema);