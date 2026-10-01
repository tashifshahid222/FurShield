import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

productSchema.statics.refreshRating = async function (productId) {
  const result = await mongoose
    .model('Review')
    .aggregate([
      { $match: { target: productId, targetType: 'product', status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

  const rating = result.length ? Math.round(result[0].avg * 10) / 10 : 0;
  const ratingCount = result.length ? result[0].count : 0;

  await this.updateOne({ _id: productId }, { $set: { rating, ratingCount } });
  return { rating, ratingCount };
};

export default mongoose.model('Product', productSchema);