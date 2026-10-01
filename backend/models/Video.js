import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['feeding', 'hygiene', 'exercise', 'grooming', 'vaccination', 'general'],
      default: 'general',
    },
    url: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    duration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
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

videoSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Video', videoSchema);