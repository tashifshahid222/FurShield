import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import { sendNotification } from '../utils/helpers.js';

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();

  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userObj,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (role === 'admin') {
    return res.status(400).json({ success: false, message: 'Cannot register as admin' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const allowedRoles = ['owner', 'veterinarian', 'shelter'];
  const userRole = allowedRoles.includes(role) ? role : 'owner';

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: userRole,
    phone: phone || '',
    status: 'active',
  });

  await sendNotification({
    recipient: user._id,
    type: 'system',
    title: 'Welcome to FurShield',
    message: `Welcome ${user.name}! Your ${userRole} account has been created successfully.`,
    link: '/dashboard',
  });

  sendTokenResponse(user, 201, res, 'Account created successfully');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({ success: false, message: 'No account found with this email address' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect password. Please try again' });
  }

  if (user.status === 'inactive') {
    return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
  }

  sendTokenResponse(user, 200, res, 'Logged in successfully');
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const fields = ['name', 'phone', 'profileImage'];
  if (req.body.address) fields.push('address');

  const updateData = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide current and new password' });
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

export const updateVeterinarianProfile = asyncHandler(async (req, res) => {
  const current = req.user.veterinarianProfile || {};
  const vetProfile = {
    specialization: req.body.specialization ?? current.specialization,
    experienceYears: req.body.experienceYears ?? current.experienceYears,
    bio: req.body.bio ?? current.bio,
    qualifications: req.body.qualifications ?? current.qualifications,
    licenseNumber: req.body.licenseNumber ?? current.licenseNumber,
    availability: req.body.availability ?? current.availability,
    consultationFee: req.body.consultationFee ?? current.consultationFee,
    isAvailable: req.body.isAvailable ?? current.isAvailable,
  };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { veterinarianProfile: vetProfile },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, message: 'Veterinarian profile updated', data: user });
});

export const updateShelterProfile = asyncHandler(async (req, res) => {
  const current = req.user.shelterProfile || {};
  const shelterProfile = {
    name: req.body.name ?? current.name,
    description: req.body.description ?? current.description,
    establishedYear: req.body.establishedYear ?? current.establishedYear,
    capacity: req.body.capacity ?? current.capacity,
    website: req.body.website ?? current.website,
    isVerified: current.isVerified,
  };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { shelterProfile: shelterProfile },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, message: 'Shelter profile updated', data: user });
});