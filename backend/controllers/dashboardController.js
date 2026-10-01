import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Appointment from '../models/Appointment.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import AdoptionListing from '../models/AdoptionListing.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import CareArticle from '../models/CareArticle.js';
import Faq from '../models/Faq.js';
import Video from '../models/Video.js';
import Notification from '../models/Notification.js';
import ContactMessage from '../models/ContactMessage.js';
import HealthRecord from '../models/HealthRecord.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const [
    totalUsers,
    totalOwners,
    totalVets,
    totalShelters,
    totalPets,
    totalProducts,
    totalOrders,
    totalAppointments,
    totalAdoptions,
    totalReviews,
    totalNotifications,
    totalMessages,
    pendingOrders,
    pendingAppointments,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: 'owner' }),
    User.countDocuments({ role: 'veterinarian' }),
    User.countDocuments({ role: 'shelter' }),
    Pet.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
    Appointment.countDocuments({}),
    AdoptionListing.countDocuments({}),
    Review.countDocuments({}),
    Notification.countDocuments({}),
    ContactMessage.countDocuments({}),
    Order.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({ status: 'requested' }),
  ]);

  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const recentOrders = await Order.find({}).populate('owner', 'name').sort({ createdAt: -1 }).limit(5);
  const recentAppointments = await Appointment.find({})
    .populate('owner', 'name')
    .populate('pet', 'name species')
    .sort({ createdAt: -1 })
    .limit(5);
  const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5);

  res.status(200).json({
    success: true,
    data: {
      users: { total: totalUsers, owners: totalOwners, veterinarians: totalVets, shelters: totalShelters },
      pets: totalPets,
      products: totalProducts,
      orders: { total: totalOrders, pending: pendingOrders, revenue: totalRevenue.length ? totalRevenue[0].total : 0 },
      appointments: { total: totalAppointments, pending: pendingAppointments },
      adoptions: totalAdoptions,
      reviews: totalReviews,
      notifications: totalNotifications,
      messages: totalMessages,
      categories: await Category.countDocuments({}),
      articles: await CareArticle.countDocuments({}),
      faqs: await Faq.countDocuments({}),
      videos: await Video.countDocuments({}),
      recentOrders,
      recentAppointments,
      recentUsers,
    },
  });
});

export const getOwnerDashboard = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const [pets, appointments, orders, notifications, healthRecords] = await Promise.all([
    Pet.find({ owner: ownerId }),
    Appointment.find({ owner: ownerId })
      .populate('pet', 'name species image')
      .populate('veterinarian', 'name')
      .sort({ date: 1 })
      .limit(10),
    Order.find({ owner: ownerId }).sort({ createdAt: -1 }).limit(10),
    Notification.find({ recipient: ownerId, isRead: false }).sort({ createdAt: -1 }).limit(5),
    (async () => {
      const petIds = (await Pet.find({ owner: ownerId })).map((p) => p._id);
      return await HealthRecord.find({ pet: { $in: petIds }, nextDueDate: { $ne: null } })
        .populate('pet', 'name')
        .sort({ nextDueDate: 1 })
        .limit(10);
    })(),
  ]);

  const upcomingAppointments = appointments.filter((a) => a.date >= new Date());
  const petCount = pets.length;

  res.status(200).json({
    success: true,
    data: {
      petCount,
      pets,
      upcomingAppointments,
      recentOrders: orders,
      healthReminders: healthRecords,
      notifications,
    },
  });
});

export const getVetDashboard = asyncHandler(async (req, res) => {
  const vetId = req.user._id;

  const [appointments, patientPets, notifications] = await Promise.all([
    Appointment.find({ veterinarian: vetId })
      .populate('owner', 'name email phone')
      .populate('pet', 'name species breed image')
      .sort({ date: 1 })
      .limit(20),
    (async () => {
      const appts = await Appointment.find({ veterinarian: vetId, status: { $in: ['approved', 'completed'] } }).select('pet');
      const petIds = [...new Set(appts.map((a) => a.pet.toString()))];
      return await Pet.find({ _id: { $in: petIds } }).populate('owner', 'name');
    })(),
    Notification.find({ recipient: vetId, isRead: false }).sort({ createdAt: -1 }).limit(5),
  ]);

  const pendingRequests = await Appointment.countDocuments({ veterinarian: vetId, status: 'requested' });
  const approvedCount = await Appointment.countDocuments({ veterinarian: vetId, status: 'approved' });
  const completedCount = await Appointment.countDocuments({ veterinarian: vetId, status: 'completed' });

  res.status(200).json({
    success: true,
    data: {
      appointments,
      patientPets,
      pendingRequests,
      counts: { approved: approvedCount, completed: completedCount, pending: pendingRequests },
      notifications,
    },
  });
});

export const getShelterDashboard = asyncHandler(async (req, res) => {
  const shelterId = req.user._id;

  const [listings, notifications] = await Promise.all([
    AdoptionListing.find({ shelter: shelterId })
      .populate('adoptionInterests.adopter', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(20),
    Notification.find({ recipient: shelterId, isRead: false }).sort({ createdAt: -1 }).limit(5),
  ]);

  let totalInterests = 0;
  let pendingInterests = 0;
  listings.forEach((l) => {
    totalInterests += l.adoptionInterests.length;
    pendingInterests += l.adoptionInterests.filter((i) => i.status === 'pending').length;
  });

  const availableCount = await AdoptionListing.countDocuments({ shelter: shelterId, adoptionStatus: 'available' });
  const pendingCount = await AdoptionListing.countDocuments({ shelter: shelterId, adoptionStatus: 'pending' });
  const adoptedCount = await AdoptionListing.countDocuments({ shelter: shelterId, adoptionStatus: 'adopted' });

  res.status(200).json({
    success: true,
    data: {
      listings,
      totalInterests,
      pendingInterests,
      counts: { available: availableCount, pending: pendingCount, adopted: adoptedCount },
      notifications,
    },
  });
});