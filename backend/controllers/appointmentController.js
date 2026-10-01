import asyncHandler from '../middleware/asyncHandler.js';
import Appointment from '../models/Appointment.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { paginate, buildPaginationResult, sendNotification } from '../utils/helpers.js';

const isSlotTaken = async (veterinarianId, date, time, excludeId = null) => {
  const query = {
    veterinarian: veterinarianId,
    date: {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lte: new Date(date).setHours(23, 59, 59, 999),
    },
    time,
    status: { $in: ['requested', 'approved'] },
  };
  if (excludeId) query._id = { $ne: excludeId };

  return await Appointment.exists(query);
};

export const createAppointment = asyncHandler(async (req, res) => {
  const { petId, veterinarianId, date, time, reason, notes } = req.body;

  if (!petId || !veterinarianId || !date || !time || !reason) {
    return res.status(400).json({ success: false, message: 'Missing required appointment fields' });
  }

  const pet = await Pet.findById(petId);
  if (!pet) {
    return res.status(404).json({ success: false, message: 'Pet not found' });
  }

  if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to book for this pet' });
  }

  const vet = await User.findById(veterinarianId);
  if (!vet || vet.role !== 'veterinarian') {
    return res.status(404).json({ success: false, message: 'Veterinarian not found' });
  }

  const slotDate = new Date(date).setHours(0, 0, 0, 0);
  if (slotDate < Date.now()) {
    return res.status(400).json({ success: false, message: 'Appointment date cannot be in the past' });
  }

  if (await isSlotTaken(veterinarianId, date, time)) {
    return res.status(400).json({ success: false, message: 'This time slot is already booked. Please choose another.' });
  }

  const appointment = await Appointment.create({
    owner: req.user._id,
    pet: petId,
    veterinarian: veterinarianId,
    date: new Date(date),
    time,
    reason,
    notes: notes || '',
    status: 'requested',
  });

  await sendNotification({
    recipient: veterinarianId,
    sender: req.user._id,
    type: 'appointment_change',
    title: 'New appointment request',
    message: `You have a new appointment request for ${pet.name} on ${new Date(date).toLocaleDateString()} at ${time}.`,
    link: '/veterinarian/appointments',
    referenceId: appointment._id,
  });

  res.status(201).json({ success: true, message: 'Appointment requested successfully', data: appointment });
});

export const getAppointments = asyncHandler(async (req, res) => {
  const { status, page, limit, veterinarian, pet } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = {};

  if (req.user.role === 'owner') {
    query.owner = req.user._id;
  } else if (req.user.role === 'veterinarian') {
    query.veterinarian = req.user._id;
<<<<<<< HEAD
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to view appointments' });
=======
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
  }

  if (status) {
    query.status = status;
  }
<<<<<<< HEAD
  if (req.user.role === 'admin') {
    if (veterinarian) query.veterinarian = veterinarian;
    if (pet) query.pet = pet;
  }
=======
  if (veterinarian) query.veterinarian = veterinarian;
  if (pet) query.pet = pet;
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

  const total = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .populate('owner', 'name email phone')
    .populate('pet', 'name species breed image')
    .populate('veterinarian', 'name profileImage veterinarianProfile')
    .sort({ date: -1, time: 1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, appointments) });
});

export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('owner', 'name email phone address')
    .populate('pet')
    .populate('veterinarian', 'name phone veterinarianProfile');

  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  const isOwner = req.user.role === 'owner' && appointment.owner._id.toString() === req.user._id.toString();
  const isVet = req.user.role === 'veterinarian' && appointment.veterinarian._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isVet && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this appointment' });
  }

  res.status(200).json({ success: true, data: appointment });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { newStatus, rescheduleDate, rescheduleTime } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  const isOwner = appointment.owner.toString() === req.user._id.toString();
  const isVet = appointment.veterinarian.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isVet && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const allowedTransitions = {
    owner: {
      requested: ['cancelled'],
      approved: ['cancelled'],
    },
    veterinarian: {
      requested: ['approved', 'rejected'],
      approved: ['completed', 'rescheduled'],
    },
    admin: {
      requested: ['approved', 'rejected', 'cancelled'],
      approved: ['completed', 'rescheduled', 'cancelled'],
    },
  };

  const actor = isVet ? 'veterinarian' : isAdmin ? 'admin' : 'owner';
  const allowed = (allowedTransitions[actor] && allowedTransitions[actor][appointment.status]) || [];

  if (newStatus === 'rescheduled' && !allowed.includes('rescheduled')) {
    return res.status(400).json({ success: false, message: 'Cannot reschedule this appointment' });
  }

  if (actor !== 'owner' && !allowed.includes(newStatus)) {
    return res.status(400).json({ success: false, message: `Cannot change appointment from ${appointment.status} to ${newStatus}` });
  }

  if (newStatus === 'rescheduled') {
    if (!rescheduleDate || !rescheduleTime) {
      return res.status(400).json({ success: false, message: 'Reschedule requires new date and time' });
    }
    if (await isSlotTaken(appointment.veterinarian, rescheduleDate, rescheduleTime, appointment._id)) {
      return res.status(400).json({ success: false, message: 'New time slot is already booked' });
    }

    const previous = await Appointment.create({
      owner: appointment.owner,
      pet: appointment.pet,
      veterinarian: appointment.veterinarian,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      notes: appointment.notes,
      status: 'rescheduled',
      previousAppointment: appointment._id,
    });

    appointment.status = 'rescheduled';
    appointment.date = new Date(rescheduleDate);
    appointment.time = rescheduleTime;
    await appointment.save();

    await sendNotification({
      recipient: appointment.owner,
      sender: appointment.veterinarian,
      type: 'appointment_change',
      title: 'Appointment rescheduled',
      message: `Your appointment has been rescheduled to ${new Date(rescheduleDate).toLocaleDateString()} at ${rescheduleTime}.`,
      link: '/owner/appointments',
      referenceId: appointment._id,
    });

    return res.status(200).json({ success: true, message: 'Appointment rescheduled', data: { appointment, previous } });
  }

  appointment.status = newStatus;
  await appointment.save();

  if (newStatus === 'approved') {
    await sendNotification({
      recipient: appointment.owner,
      sender: appointment.veterinarian,
      type: 'appointment_confirmation',
      title: 'Appointment approved',
      message: `Your appointment on ${appointment.date.toLocaleDateString()} at ${appointment.time} has been approved.`,
      link: '/owner/appointments',
      referenceId: appointment._id,
    });
  } else if (newStatus === 'rejected') {
    await sendNotification({
      recipient: appointment.owner,
      sender: appointment.veterinarian,
      type: 'appointment_change',
      title: 'Appointment rejected',
      message: `Your appointment on ${appointment.date.toLocaleDateString()} at ${appointment.time} was rejected.`,
      link: '/owner/appointments',
      referenceId: appointment._id,
    });
  } else if (newStatus === 'cancelled') {
    const other = appointment.veterinarian;
    await sendNotification({
      recipient: other,
      sender: appointment.owner,
      type: 'appointment_change',
      title: 'Appointment cancelled',
      message: `An appointment has been cancelled.`,
      link: '/veterinarian/appointments',
      referenceId: appointment._id,
    });
  } else if (newStatus === 'completed') {
    const vet = await User.findById(appointment.veterinarian).select('name veterinarianProfile isActive status');
    const vetName = vet ? (vet.name || 'the veterinarian') : 'the veterinarian';
    await sendNotification({
      recipient: appointment.owner,
      sender: appointment.veterinarian,
      type: 'system',
      title: 'Appointment completed',
      message: `Your appointment with ${vetName} has been marked as completed.`,
      link: '/owner/appointments',
      referenceId: appointment._id,
    });
  }

  res.status(200).json({ success: true, message: `Appointment marked as ${newStatus}`, data: appointment });
});

export const getAvailability = asyncHandler(async (req, res) => {
  const { vetId, date } = req.query;

  if (!vetId || !date) {
    return res.status(400).json({ success: false, message: 'Veterinarian id and date are required' });
  }

  const vet = await User.findById(vetId).select('veterinarianProfile status role');
  if (!vet || vet.role !== 'veterinarian') {
    return res.status(404).json({ success: false, message: 'Veterinarian not found' });
  }

  const weekday = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  const dayName = weekday[new Date(date).getDay()];

  const dayAvailability = (vet.veterinarianProfile.availability || []).find((d) => d.day === dayName);
  const slots = dayAvailability ? dayAvailability.slots : [];

  const booked = await Appointment.find({
    veterinarian: vetId,
    date: {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lte: new Date(date).setHours(23, 59, 59, 999),
    },
    time: { $in: slots },
    status: { $in: ['requested', 'approved'] },
  }).select('time');

  const bookedTimes = new Set(booked.map((b) => b.time));
  const available = slots.filter((s) => !bookedTimes.has(s));

  res.status(200).json({ success: true, data: { date, day: dayName, availableSlots: available, bookedSlots: [...bookedTimes] } });
});