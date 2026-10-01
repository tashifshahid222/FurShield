import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must have an owner'],
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Appointment must have a pet'],
    },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must have a veterinarian'],
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    time: {
      type: String,
      required: [true, 'Appointment time is required'],
    },
    reason: {
      type: String,
      required: [true, 'Appointment reason is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['requested', 'approved', 'completed', 'rejected', 'cancelled', 'rescheduled'],
      default: 'requested',
    },
    previousAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ veterinarian: 1, date: 1, time: 1 });
appointmentSchema.index({ owner: 1 });
appointmentSchema.index({ pet: 1 });

export default mongoose.model('Appointment', appointmentSchema);