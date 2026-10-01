import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Appointment from '../models/Appointment.js';
import AdoptionListing from '../models/AdoptionListing.js';
import { paginate, buildPaginationResult, sendNotification, escapeRegex } from '../utils/helpers.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, role, status } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = {};
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: escapeRegex(search), $options: 'i' } },
      { email: { $regex: escapeRegex(search), $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, users) });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, phone, status, role, address, shelterProfile } = req.body;
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (status !== undefined) updateData.status = status;
  if (role !== undefined && req.user.role === 'admin') updateData.role = role;
  if (address !== undefined) updateData.address = address;
  if (shelterProfile !== undefined && typeof shelterProfile === 'object' && req.user.role === 'admin') {
    updateData.shelterProfile = shelterProfile;
  }

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, message: 'User updated successfully', data: user });
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: 'inactive' },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await sendNotification({
    recipient: user._id,
    type: 'system',
    title: 'Account status updated',
    message: 'Your account has been deactivated by an administrator.',
  });

  res.status(200).json({ success: true, message: 'User deactivated successfully', data: user });
});

export const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: 'active' },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await sendNotification({
    recipient: user._id,
    type: 'system',
    title: 'Account status updated',
    message: 'Your account has been reactivated by an administrator.',
  });

  res.status(200).json({ success: true, message: 'User activated successfully', data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.role === 'admin') {
    return res.status(400).json({ success: false, message: 'Cannot delete an admin account' });
  }

  await Pet.deleteMany({ owner: user._id });
  await Appointment.deleteMany({ $or: [{ owner: user._id }, { veterinarian: user._id }] });
  await AdoptionListing.deleteMany({ shelter: user._id });

  await user.deleteOne();

  res.status(200).json({ success: true, message: 'User and associated records deleted' });
});

export const getPublicVeterinarians = asyncHandler(async (req, res) => {
  const { search, specialization, city, name, page, limit } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = { role: 'veterinarian', status: 'active' };

  if (search) {
    query.$or = [
      { name: { $regex: escapeRegex(search), $options: 'i' } },
      { 'veterinarianProfile.specialization': { $regex: escapeRegex(search), $options: 'i' } },
      { 'veterinarianProfile.bio': { $regex: escapeRegex(search), $options: 'i' } },
      { 'address.city': { $regex: escapeRegex(search), $options: 'i' } },
    ];
  }
  if (specialization) {
    query['veterinarianProfile.specialization'] = { $regex: escapeRegex(specialization), $options: 'i' };
  }
  if (name) {
    query.name = { $regex: escapeRegex(name), $options: 'i' };
  }
  if (city) {
    query['address.city'] = { $regex: escapeRegex(city), $options: 'i' };
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('name profileImage phone address veterinarianProfile rating createdAt')
    .sort({ name: 1 })
    .skip(skip)
    .limit(limitNum);

  const enriched = await Promise.all(
    users.map(async (vet) => {
      const v = vet.toObject();
      const appointments = await Appointment.find({
        veterinarian: vet._id,
        status: 'completed',
      }).countDocuments();
      v.totalAppointments = appointments;
      return v;
    })
  );

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, enriched) });
});

export const getPublicVeterinarianById = asyncHandler(async (req, res) => {
  const vet = await User.findOne({ _id: req.params.id, role: 'veterinarian', status: 'active' })
    .select('name profileImage phone address veterinarianProfile rating createdAt');

  if (!vet) {
    return res.status(404).json({ success: false, message: 'Veterinarian not found' });
  }

  const v = vet.toObject();
  const totalAppointments = await Appointment.find({
    veterinarian: vet._id,
    status: 'completed',
  }).countDocuments();
  v.totalAppointments = totalAppointments;

  res.status(200).json({ success: true, data: v });
});

export const getPublicShelters = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = { role: 'shelter', status: 'active' };
  if (search) {
    query.$or = [
      { name: { $regex: escapeRegex(search), $options: 'i' } },
      { 'shelterProfile.name': { $regex: escapeRegex(search), $options: 'i' } },
      { 'address.city': { $regex: escapeRegex(search), $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const shelters = await User.find(query)
    .select('name profileImage phone address shelterProfile')
    .sort({ name: 1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, shelters) });
});