import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Record must be linked to a pet'],
    },
    recordType: {
      type: String,
      enum: [
        'vaccination',
        'allergy',
        'illness',
        'diagnosis',
        'treatment',
        'medication',
        'observation',
        'lab_result',
        'prescription',
        'follow_up',
        'medical_document',
        'certificate',
        'xray',
        'insurance',
      ],
      required: [true, 'Record type is required'],
    },
    title: {
      type: String,
      required: [true, 'Record title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    documents: [
      {
        type: String,
      },
    ],
    medicines: [
      {
        name: { type: String, default: '' },
        dosage: { type: String, default: '' },
        frequency: { type: String, default: '' },
        duration: { type: String, default: '' },
      },
    ],
    followUpInstructions: {
      type: String,
      default: '',
    },
    nextDueDate: {
      type: Date,
      default: null,
    },
    insurer: {
      type: String,
      default: '',
    },
    policyNumber: {
      type: String,
      default: '',
    },
    insuredAmount: {
      type: Number,
      default: 0,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

healthRecordSchema.index({ pet: 1, recordType: 1 });
healthRecordSchema.index({ date: -1 });

export default mongoose.model('HealthRecord', healthRecordSchema);