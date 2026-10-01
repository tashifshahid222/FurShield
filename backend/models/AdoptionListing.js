import mongoose from 'mongoose';

const adoptionListingSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea pig', 'fish', 'reptile', 'other'],
      default: 'dog',
    },
    breed: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      min: 0,
      default: 0,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    color: {
      type: String,
      default: '',
    },
    weight: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    healthStatus: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    behaviouralNotes: {
      type: String,
      default: '',
    },
    specialNeeds: {
      type: Boolean,
      default: false,
    },
    adoptionFee: {
      type: Number,
      min: 0,
      default: 0,
    },
    location: {
      type: String,
      default: '',
    },
    statusNotes: {
      type: String,
      default: '',
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Listing must belong to a shelter'],
    },
    adoptionStatus: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
    },
    vaccinated: {
      type: Boolean,
      default: false,
    },
    neutered: {
      type: Boolean,
      default: false,
    },
    careRecord: [
      {
        type: {
          type: String,
          enum: ['feeding', 'grooming', 'medical'],
          default: 'feeding',
        },
        date: { type: Date, default: Date.now },
        description: { type: String, default: '' },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    adoptionInterests: [
      {
        adopter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: { type: String, default: '' },
        phone: { type: String, default: '' },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

adoptionListingSchema.index({ species: 1 });
adoptionListingSchema.index({ adoptionStatus: 1 });
adoptionListingSchema.index({ petName: 'text', description: 'text' });

export default mongoose.model('AdoptionListing', adoptionListingSchema);