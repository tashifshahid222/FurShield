import asyncHandler from '../middleware/asyncHandler.js';
import HealthRecord from '../models/HealthRecord.js';
import Pet from '../models/Pet.js';
import Appointment from '../models/Appointment.js';
import { paginate, buildPaginationResult } from '../utils/helpers.js';

const canAccessPet = async (user, petId) => {
<<<<<<< HEAD
  if (!user) return false;
=======
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
  if (user.role === 'admin') return true;

  if (user.role === 'owner') {
    const pet = await Pet.findById(petId);
    return pet && pet.owner.toString() === user._id.toString();
  }

  if (user.role === 'veterinarian') {
    const appointment = await Appointment.findOne({
      veterinarian: user._id,
      pet: petId,
      status: { $in: ['approved', 'completed'] },
    });
<<<<<<< HEAD
    if (appointment) return true;

    const record = await HealthRecord.findOne({
      pet: petId,
      $or: [{ vet: user._id }, { recordedBy: user._id }],
    });
    return !!record;
=======
    return !!appointment;
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
  }

  return false;
};

export const getRecordsForPet = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  const pet = await Pet.findById(petId);
  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  const hasAccess = await canAccessPet(req.user, petId);
  if (!hasAccess) {
    return res.status(403).json({ success: false, message: 'Not authorized to view these records' });
  }

  const records = await HealthRecord.find({ pet: petId }).sort({ date: -1 }).populate('vet', 'name');

  res.status(200).json({ success: true, data: records });
});

export const getRecordById = asyncHandler(async (req, res) => {
  const record = await HealthRecord.findById(req.params.id).populate('pet', 'name species').populate('vet', 'name');

  if (!record) {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  const hasAccess = await canAccessPet(req.user, record.pet._id);
  if (!hasAccess) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this record' });
  }

  res.status(200).json({ success: true, data: record });
});

export const createRecord = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  const pet = await Pet.findById(petId);
  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  if (req.user.role === 'owner') {
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add records for this pet' });
    }
  } else if (req.user.role === 'veterinarian') {
    const appointment = await Appointment.findOne({
      veterinarian: req.user._id,
      pet: petId,
      status: { $in: ['approved', 'completed'] },
    });
    if (!appointment) {
      return res.status(403).json({ success: false, message: 'No appointment found for this pet' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const record = await HealthRecord.create({
    pet: petId,
    recordType: req.body.recordType,
    title: req.body.title,
    description: req.body.description || '',
    vet: req.user.role === 'veterinarian' ? req.user._id : req.body.vet || null,
    date: req.body.date || Date.now(),
    documents: req.file ? [`/uploads/${req.file.filename}`] : req.body.documents || [],
    medicines: req.body.medicines || [],
    followUpInstructions: req.body.followUpInstructions || '',
    nextDueDate: req.body.nextDueDate || null,
    insurer: req.body.insurer || '',
    policyNumber: req.body.policyNumber || '',
    insuredAmount: req.body.insuredAmount || 0,
    recordedBy: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Health record added', data: record });
});

export const updateRecord = asyncHandler(async (req, res) => {
  const record = await HealthRecord.findById(req.params.id);
  if (!record) {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  const hasAccess = await canAccessPet(req.user, record.pet);
  if (!hasAccess) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this record' });
  }

  const allowedFields = [
    'recordType', 'title', 'description', 'date', 'documents',
    'medicines', 'followUpInstructions', 'nextDueDate',
    'insurer', 'policyNumber', 'insuredAmount',
  ];

  const updateData = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f];
  });

  if (req.file) {
    updateData.documents = [...(record.documents || []), `/uploads/${req.file.filename}`];
  }

  const updated = await HealthRecord.findByIdAndUpdate(record._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: 'Record updated', data: updated });
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const record = await HealthRecord.findById(req.params.id);
  if (!record) {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  const hasAccess = await canAccessPet(req.user, record.pet);
  if (!hasAccess) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this record' });
  }

  await record.deleteOne();

  res.status(200).json({ success: true, message: 'Record deleted' });
});

export const getVetRecords = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  const pet = await Pet.findById(petId);
  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  const appointment = await Appointment.findOne({
    veterinarian: req.user._id,
    pet: petId,
    status: { $in: ['approved', 'completed'] },
  });

  if (!appointment) {
    return res.status(403).json({ success: false, message: 'No appointment found for this pet' });
  }

  const records = await HealthRecord.find({ pet: petId }).sort({ date: -1 }).populate('vet', 'name');

  res.status(200).json({ success: true, data: records });
});

export const generateTimeline = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  const hasAccess = await canAccessPet(req.user, petId);
  if (!hasAccess) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const records = await HealthRecord.find({ pet: petId })
    .sort({ date: -1 })
    .populate('vet', 'name');

  const timeline = records.map((r) => ({
    id: r._id,
    type: r.recordType,
    title: r.title,
    date: r.date,
    described: r.description,
    vet: r.vet ? r.vet.name : 'Owner',
  }));

  res.status(200).json({ success: true, data: timeline });
});

export const getMyPetRecords = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const pets = await Pet.find({ owner: ownerId }).select('_id');
  const petIds = pets.map((p) => p._id);

  const { recordType, page, limit } = req.query;
  const query = { pet: { $in: petIds } };
  if (recordType) query.recordType = recordType;

  const { pageNum, limitNum, skip } = paginate(page, limit);
  const total = await HealthRecord.countDocuments(query);
  const records = await HealthRecord.find(query)
    .populate('pet', 'name species image')
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, records) });
});