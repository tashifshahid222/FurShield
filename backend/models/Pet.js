import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      maxlength: [100],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other'],
      default: 'dog',
    },
    breed: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      default: 0,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      default: 0,
    },
    color: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: Date,
    },
    description: {
      type: String,
      maxlength: [2000],
      default: '',
    },
    medicalSummary: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    gallery: [
      {
        type: String,
      },
    ],
    microchipped: {
      type: Boolean,
      default: false,
    },
    microchipNumber: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pet must have an owner'],
    },
  },
  {
    timestamps: true,
  }
);

petSchema.index({ owner: 1 });
petSchema.index({ species: 1 });
petSchema.index({ name: 'text' });

export default mongoose.model('Pet', petSchema);