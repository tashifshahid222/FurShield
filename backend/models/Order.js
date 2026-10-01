import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ owner: 1 });
orderSchema.index({ orderDate: -1 });

export default mongoose.model('Order', orderSchema);