import asyncHandler from '../middleware/asyncHandler.js';
import Pet from '../models/Pet.js';
import HealthRecord from '../models/HealthRecord.js';
import Appointment from '../models/Appointment.js';
import { paginate, buildPaginationResult, escapeRegex, removeUpload } from '../utils/helpers.js';

// Owners may access their own pets; admins may access any pet.
// Veterinarians may access a pet if they have a related appointment or health record.
const canAccessPet = async (user, pet) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'veterinarian') {
    const appointment = await Appointment.findOne({ veterinarian: user._id, pet: pet._id });
    if (appointment) return true;
    const record = await HealthRecord.findOne({
      pet: pet._id,
      $or: [{ vet: user._id }, { recordedBy: user._id }],
    });
    return !!record;
  }
  return pet.owner.toString() === user._id.toString();
};

// Only the pet's owner or an admin may modify the pet.
const canModifyPet = (user, pet) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return pet.owner.toString() === user._id.toString();
};

export const getPets = asyncHandler(async (req, res) => {
  const { page, limit, search, species } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = {};

  if (req.user.role === 'owner') {
    query.owner = req.user._id;
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to list all pets' });
  }
  if (search) {
    query.$or = [
      { name: { $regex: escapeRegex(search), $options: 'i' } },
      { breed: { $regex: escapeRegex(search), $options: 'i' } },
    ];
  }
  if (species) query.species = species;

  const total = await Pet.countDocuments(query);
  const pets = await Pet.find(query)
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, pets) });
});

export const getMyPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: pets });
});

export const getPetById = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  const hasAccess = await canAccessPet(req.user, pet);
  if (!hasAccess) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this pet' });
  }

  const populated = await pet.populate('owner', 'name email phone');

  res.status(200).json({ success: true, data: populated });
});

export const createPet = asyncHandler(async (req, res) => {
  const {
    name, species, breed, age, gender, weight, color,
    dateOfBirth, description, medicalSummary, image, microchipped, microchipNumber,
  } = req.body;

  const pet = await Pet.create({
    name,
    species,
    breed: breed || '',
    age: age || 0,
    gender: gender || 'unknown',
    weight: weight || 0,
    color: color || '',
    dateOfBirth: dateOfBirth || undefined,
    description: description || '',
    medicalSummary: medicalSummary || '',
    image: image || (req.file ? `/uploads/${req.file.filename}` : ''),
    microchipped: microchipped || false,
    microchipNumber: microchipNumber || '',
    owner: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Pet added successfully', data: pet });
});

export const updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  if (!canModifyPet(req.user, pet)) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this pet' });
  }

  const allowedFields = [
    'name', 'species', 'breed', 'age', 'gender', 'weight', 'color',
    'dateOfBirth', 'description', 'medicalSummary', 'microchipped', 'microchipNumber',
  ];

  const updateData = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f];
  });

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  const previousImage = pet.image;
  const updated = await Pet.findByIdAndUpdate(pet._id, updateData, { new: true, runValidators: true });

  if (updateData.image && previousImage && previousImage !== updateData.image) {
    await removeUpload(previousImage);
  }

  res.status(200).json({ success: true, message: 'Pet updated successfully', data: updated });
});

export const deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  if (!canModifyPet(req.user, pet)) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this pet' });
  }

  const images = [pet.image, ...(pet.gallery || [])].filter(Boolean);
  await HealthRecord.deleteMany({ pet: pet._id });
  await pet.deleteOne();

  for (const img of images) {
    await removeUpload(img);
  }

  res.status(200).json({ success: true, message: 'Pet and its health records deleted' });
});

export const addToGallery = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  if (!canModifyPet(req.user, pet)) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this pet' });
  }

  if (req.file) {
    pet.gallery.push(`/uploads/${req.file.filename}`);
  } else if (req.body.imageUrl) {
    pet.gallery.push(req.body.imageUrl);
  } else {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }

  await pet.save();

  res.status(200).json({ success: true, message: 'Image added to gallery', data: pet });
});

export const removeFromGallery = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  if (!canModifyPet(req.user, pet)) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this pet' });
  }

  pet.gallery = pet.gallery.filter((img) => img !== req.body.imageUrl);
  await pet.save();

  await removeUpload(req.body.imageUrl);

  res.status(200).json({ success: true, message: 'Image removed from gallery', data: pet });
});

export const getPetsForVet = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    veterinarian: req.user._id,
    status: { $in: ['approved', 'completed'] },
  }).select('pet');

  const petIds = [...new Set(appointments.map((a) => a.pet.toString()))];

  const pets = await Pet.find({ _id: { $in: petIds } }).populate('owner', 'name email phone');

  res.status(200).json({ success: true, data: pets });
});