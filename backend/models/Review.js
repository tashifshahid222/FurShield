import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['veterinarian', 'shelter', 'product'],
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetModel',
      required: true,
    },
    targetModel: {
      type: String,
      enum: ['User', 'User', 'Product'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ target: 1, targetType: 1 });
reviewSchema.index({ author: 1, target: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);