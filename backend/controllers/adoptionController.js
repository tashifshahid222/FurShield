import asyncHandler from '../middleware/asyncHandler.js';
import AdoptionListing from '../models/AdoptionListing.js';
import User from '../models/User.js';
import { paginate, buildPaginationResult, sendNotification, escapeRegex, removeUpload } from '../utils/helpers.js';

export const getListings = asyncHandler(async (req, res) => {
  const { page, limit, search, species, adoptionStatus, shelter } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = {};
  if (req.query.public === 'true' || !req.query.includeAll) {
    query.adoptionStatus = { $ne: 'adopted' };
  }
  if (species) query.species = species;
  if (adoptionStatus) query.adoptionStatus = adoptionStatus;
  if (shelter) query.shelter = shelter;
  if (search) {
    query.$or = [
      { petName: { $regex: escapeRegex(search), $options: 'i' } },
      { breed: { $regex: escapeRegex(search), $options: 'i' } },
      { description: { $regex: escapeRegex(search), $options: 'i' } },
    ];
  }

  const total = await AdoptionListing.countDocuments(query);
  const listings = await AdoptionListing.find(query)
    .populate('shelter', 'name profileImage shelterProfile')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, listings) });
});

export const getListingById = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findById(req.params.id)
    .populate('shelter', 'name profileImage shelterProfile');

  if (!listing) {
    return res.status(404).json({ success: false, message: 'Adoption listing not found' });
  }

  // Adopter contact details are only visible to the shelter that owns the
  // listing (or an admin); this endpoint is publicly reachable.
  const canSeeInterests =
    req.user && (req.user.role === 'admin' || listing.shelter._id.toString() === req.user._id.toString());

  const result = listing.toObject();

  if (canSeeInterests) {
    await listing.populate('adoptionInterests.adopter', 'name email phone');
    result.adoptionInterests = listing.adoptionInterests;
  } else {
    // Keep the adopter id so the UI can tell whether the current user applied,
    // but strip the name, email and phone of everyone else.
    result.adoptionInterests = (listing.adoptionInterests || []).map((i) => ({
      _id: i._id,
      adopter: { _id: i.adopter },
      message: '',
      phone: '',
      status: i.status,
      date: i.date,
    }));
  }

  res.status(200).json({ success: true, data: result });
});

export const createListing = asyncHandler(async (req, res) => {
  if (req.user.role !== 'shelter' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only shelters can create adoption listings' });
  }

  const {
    petName, species, breed, age, gender, healthStatus, description,
    adoptionStatus, vaccinated, neutered, color, weight, behaviouralNotes,
    specialNeeds, adoptionFee, location, statusNotes,
  } = req.body;

  const listing = await AdoptionListing.create({
    petName,
    species: species || 'dog',
    breed: breed || '',
    age: age === '' || age == null ? 0 : Number(age),
    gender: gender || 'unknown',
    color: color || '',
    weight: weight === '' || weight == null ? 0 : Number(weight),
    images: req.files ? req.files.map((f) => `/uploads/${f.filename}`) : (req.body.images || []),
    healthStatus: healthStatus || '',
    description,
    behaviouralNotes: behaviouralNotes || '',
    specialNeeds: specialNeeds === true || specialNeeds === 'true',
    adoptionFee: adoptionFee === '' || adoptionFee == null ? 0 : Number(adoptionFee),
    location: location || '',
    statusNotes: statusNotes || '',
    shelter: req.user._id,
    adoptionStatus: adoptionStatus || 'available',
    vaccinated: vaccinated === true || vaccinated === 'true',
    neutered: neutered === true || neutered === 'true',
  });

  res.status(201).json({ success: true, message: 'Adoption listing created', data: listing });
});

export const updateListing = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  const isOwner = listing.shelter.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
  }

  const allowedFields = [
    'petName', 'species', 'breed', 'age', 'gender', 'healthStatus',
    'description', 'adoptionStatus', 'vaccinated', 'neutered',
    'color', 'weight', 'behaviouralNotes', 'specialNeeds',
    'adoptionFee', 'location', 'statusNotes',
  ];
  const updateData = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f];
  });
  for (const f of ['age', 'weight', 'adoptionFee']) {
    if (updateData[f] !== undefined) updateData[f] = Number(updateData[f]) || 0;
  }

  if (req.body.existingImages) {
    updateData.images = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
  }
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => `/uploads/${f.filename}`);
    updateData.images = [...(updateData.images || listing.images || []), ...newImages];
  }
  const removedImages = [];
  if (req.body.removeImages) {
    const toRemove = Array.isArray(req.body.removeImages) ? req.body.removeImages : [req.body.removeImages];
    updateData.images = (updateData.images || listing.images).filter((img) => !toRemove.includes(img));
    removedImages.push(...toRemove);
  }

  const updated = await AdoptionListing.findByIdAndUpdate(listing._id, updateData, {
    new: true,
    runValidators: true,
  });

  for (const img of removedImages) {
    await removeUpload(img);
  }

  res.status(200).json({ success: true, message: 'Listing updated', data: updated });
});

export const deleteListing = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  const isOwner = listing.shelter.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
  }

  await listing.deleteOne();

  for (const img of listing.images || []) {
    await removeUpload(img);
  }

  res.status(200).json({ success: true, message: 'Listing deleted' });
});

export const addCareRecord = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  const isOwner = listing.shelter.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const { type, description } = req.body;
  if (!type || !description) {
    return res.status(400).json({ success: false, message: 'Care type and description are required' });
  }

  listing.careRecord.push({
    type,
    description,
    date: req.body.date || Date.now(),
    addedBy: req.user._id,
  });

  await listing.save();
  res.status(200).json({ success: true, message: 'Care record added', data: listing });
});

export const submitInterest = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Adoption listing not found' });
  }

  if (listing.adoptionStatus === 'adopted') {
    return res.status(400).json({ success: false, message: 'This pet has already been adopted' });
  }

  const alreadyInterested = listing.adoptionInterests.find(
    (i) => i.adopter.toString() === req.user._id.toString()
  );

  if (alreadyInterested) {
    return res.status(400).json({ success: false, message: 'You have already submitted interest for this pet' });
  }

  listing.adoptionInterests.push({
    adopter: req.user._id,
    message: req.body.message || '',
    phone: req.body.phone || '',
    status: 'pending',
  });

  if (listing.adoptionStatus === 'available') {
    listing.adoptionStatus = 'pending';
  }

  await listing.save();

  await sendNotification({
    recipient: listing.shelter,
    sender: req.user._id,
    type: 'adoption_update',
    title: 'New adoption interest',
    message: `${req.user.name} is interested in adopting ${listing.petName}.`,
    link: '/shelter/adoptions',
    referenceId: listing._id,
  });

  res.status(200).json({ success: true, message: 'Adoption interest submitted', data: listing });
});

export const updateInterest = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  const isOwner = listing.shelter.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const { interestId, status } = req.body;
  const interest = listing.adoptionInterests.id(interestId);
  if (!interest) {
    return res.status(404).json({ success: false, message: 'Interest not found' });
  }

  interest.status = status;

  const hasActiveInterests = listing.adoptionInterests.some(
    (i) => i.status === 'pending' || i.status === 'approved'
  );
  if (!hasActiveInterests && listing.adoptionStatus === 'pending') {
    listing.adoptionStatus = 'available';
  }

  await listing.save();

  await sendNotification({
    recipient: interest.adopter,
    sender: listing.shelter,
    type: 'adoption_update',
    title: `Adoption ${status}`,
    message: `Your adoption interest for ${listing.petName} has been ${status}.`,
    link: '/adoption',
    referenceId: listing._id,
  });

  res.status(200).json({ success: true, message: 'Interest updated', data: listing });
});

export const markAdopted = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  const isOwner = listing.shelter.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  listing.adoptionStatus = 'adopted';
  await listing.save();

  const adopterIds = listing.adoptionInterests.map((i) => i.adopter._id || i.adopter);
  for (const adopterId of adopterIds) {
    await sendNotification({
      recipient: adopterId,
      sender: listing.shelter,
      type: 'adoption_update',
      title: 'Adoption update',
      message: `${listing.petName} has been adopted. Thank you for your interest.`,
      link: '/adoption',
      referenceId: listing._id,
    });
  }

  res.status(200).json({ success: true, message: `${listing.petName} marked as adopted`, data: listing });
});

export const getMyShelterListings = asyncHandler(async (req, res) => {
  const listings = await AdoptionListing.find({ shelter: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: listings });
});