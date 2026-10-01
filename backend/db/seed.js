import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Pet from '../models/Pet.js';
import HealthRecord from '../models/HealthRecord.js';
import AdoptionListing from '../models/AdoptionListing.js';
import CareArticle from '../models/CareArticle.js';
import Faq from '../models/Faq.js';
import Video from '../models/Video.js';

dotenv.config();

<<<<<<< HEAD
console.warn(
  '============================================================\n' +
  '  SEED WARNING: this script creates DEMO accounts with known\n' +
  '  passwords (admin@..., vets, shelters). Never run it against\n' +
  '  a production database.\n' +
  '============================================================'
);

=======
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furshield');
  console.log('Connected to MongoDB');
};

const createAdmin = async () => {
  let admin = await User.findOne({ email: 'admin@furshield.com' });
  if (!admin) {
    admin = await User.create({
      name: 'System Administrator',
      email: 'admin@furshield.com',
      password: 'admin123',
      role: 'admin',
      phone: '+15550000000',
      status: 'active',
    });
    console.log('Admin created');
  } else {
    console.log('Admin already exists');
  }
};

const createCategories = async () => {
  const cats = [
    { name: 'Food', description: 'Nutritional food for all pets' },
    { name: 'Grooming', description: 'Grooming supplies and care products' },
    { name: 'Toys', description: 'Fun and engaging toys' },
    { name: 'Accessories', description: 'Collars, leashes, beds and more' },
    { name: 'Health Supplies', description: 'Vitamins, supplements and health care' },
    { name: 'Training Aids', description: 'Training tools and aids' },
  ];

  const created = [];
  for (const c of cats) {
    const existing = await Category.findOne({ name: c.name });
    if (!existing) {
      created.push(await Category.create(c));
    } else {
      created.push(existing);
    }
  }
  console.log(`${created.length} categories ensured`);
  return created;
};

const createProducts = async (categories) => {
  const foodCat = categories.find((c) => c.name === 'Food');
  const groomCat = categories.find((c) => c.name === 'Grooming');
  const toysCat = categories.find((c) => c.name === 'Toys');
  const accCat = categories.find((c) => c.name === 'Accessories');
  const healthCat = categories.find((c) => c.name === 'Health Supplies');

  const products = [
    { name: 'Premium Dog Food 5kg', description: 'High-protein complete nutrition for adult dogs.', category: foodCat._id, price: 42.99, stock: 50, rating: 4.8, ratingCount: 120, featured: true, image: '/uploads/seed-food-dog.jpg' },
    { name: 'Grain-Free Cat Food 3kg', description: 'Grain-free formula with real chicken for healthy cats.', category: foodCat._id, price: 35.5, stock: 40, rating: 4.6, ratingCount: 88, featured: true, image: '/uploads/seed-food-cat.jpg' },
    { name: 'Gentle Puppy Shampoo', description: 'pH-balanced tear-free shampoo for puppies.', category: groomCat._id, price: 12.99, stock: 75, rating: 4.5, ratingCount: 64, image: '/uploads/seed-shampoo.jpg' },
    { name: 'Rubber Chew Toy', description: 'Durable rubber chew toy that promotes dental health.', category: toysCat._id, price: 9.99, stock: 120, rating: 4.4, ratingCount: 200, featured: true, image: '/uploads/seed-chew-toy.jpg' },
    { name: 'Soft Orthopedic Dog Bed', description: 'Memory foam bed for joint relief in senior dogs.', category: accCat._id, price: 79.99, stock: 25, rating: 4.9, ratingCount: 45, featured: true, image: '/uploads/seed-dog-bed.jpg' },
    { name: 'Multivitamin for Dogs', description: 'Daily multivitamin with omega-3 for shiny coat.', category: healthCat._id, price: 18.75, stock: 60, rating: 4.3, ratingCount: 72, image: '/uploads/seed-vitamins.jpg' },
    { name: 'Catnip Kickeroo Toy', description: 'Catnip-filled kicker toy for active cats.', category: toysCat._id, price: 7.99, stock: 90, rating: 4.7, ratingCount: 150, image: '/uploads/seed-cat-toy.jpg' },
    { name: 'Dog Grooming Brush Set', description: 'Slicker brush and comb set for all coat types.', category: groomCat._id, price: 16.5, stock: 55, rating: 4.2, ratingCount: 38, image: '/uploads/seed-grooming-brush.jpg' },
    { name: 'Adjustable Harness', description: 'No-pull harness with padded chest for comfort.', category: accCat._id, price: 24.99, stock: 45, rating: 4.6, ratingCount: 90, image: '/uploads/seed-harness.jpg' },
    { name: 'Flea & Tick Treatment', description: 'Monthly topical treatment for dogs up to 25kg.', category: healthCat._id, price: 22.0, stock: 30, rating: 4.4, ratingCount: 55, image: '/uploads/seed-flea-tick.jpg' },
  ];

  let count = 0;
  for (const p of products) {
    const existing = await Product.findOne({ name: p.name });
    if (!existing) {
      await Product.create(p);
      count++;
    } else if (!existing.image) {
      await Product.updateOne({ _id: existing._id }, { $set: { image: p.image } });
    }
  }
  console.log(`${count} products created`);
};

const createSampleUsers = async () => {
  const vet = await User.findOne({ email: 'vet@furshield.com' });
  if (!vet) {
    await User.create({
      name: 'Dr. Amanda Wilson',
      email: 'vet@furshield.com',
      password: 'vet12345',
      role: 'veterinarian',
      phone: '+15551112222',
      status: 'active',
      address: { city: 'Springfield' },
      veterinarianProfile: {
        specialization: 'Small Animal Medicine',
        experienceYears: 12,
        bio: 'Experienced veterinarian focusing on preventive care and dermatology.',
        qualifications: 'DVM, University of Veterinary Sciences',
        licenseNumber: 'LIC-44821',
        consultationFee: 60,
        isAvailable: true,
        availability: [
          { day: 'Monday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { day: 'Friday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
        ],
      },
    });
    console.log('Veterinarian created');
  }

  const shelter = await User.findOne({ email: 'shelter@furshield.com' });
  if (!shelter) {
    await User.create({
      name: 'Happy Paws Shelter',
      email: 'shelter@furshield.com',
      password: 'shelter123',
      role: 'shelter',
      phone: '+15553334444',
      status: 'active',
      address: { city: 'Springfield' },
      shelterProfile: {
        name: 'Happy Paws Shelter',
        description: 'A no-kill shelter dedicated to finding forever homes for abandoned pets.',
        establishedYear: 2015,
        capacity: 80,
        website: 'https://happypaws.example.com',
        isVerified: true,
      },
    });
    console.log('Shelter created');
  }
};

const createSamplePetsAndAdoptions = async () => {
  const owner = await User.findOne({ email: 'vet@furshield.com' }).select('_id');

  const shelter = await User.findOne({ email: 'shelter@furshield.com' });
  if (!shelter) return;

  const exists = await AdoptionListing.countDocuments();
  if (exists > 0) {
    const missing = await AdoptionListing.find({ $or: [{ images: { $exists: false } }, { images: { $size: 0 } }] });
    for (const l of missing) {
      const img = l.species === 'cat' ? '/uploads/seed-adopt-cat.jpg' : l.species === 'dog' ? '/uploads/seed-adopt-dog.jpg' : '/uploads/seed-kitten.jpg';
      await AdoptionListing.updateOne({ _id: l._id }, { $set: { images: [img] } });
      console.log('backfilled image for', l.petName);
    }
    return;
  }

  await AdoptionListing.create({
    petName: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    healthStatus: 'Vaccinated, healthy',
    description: 'Buddy is a friendly, energetic golden retriever who loves long walks and belly rubs.',
    shelter: shelter._id,
    adoptionStatus: 'available',
    vaccinated: true,
    neutered: true,
    images: ['/uploads/seed-adopt-dog.jpg'],
  });
  await AdoptionListing.create({
    petName: 'Mittens',
    species: 'cat',
    breed: 'Domestic Shorthair',
    age: 2,
    gender: 'female',
    healthStatus: 'Vaccinated, spayed',
    description: 'Mittens is a sweet, quiet cat who enjoys sunny windowsills and gentle pets.',
    shelter: shelter._id,
    adoptionStatus: 'available',
    vaccinated: true,
    neutered: true,
    images: ['/uploads/seed-adopt-cat.jpg'],
  });

  console.log('Adoption listings created');
};

const createCareContent = async () => {
  const admin = await User.findOne({ email: 'admin@furshield.com' });

  const articleCount = await CareArticle.countDocuments();
  if (articleCount === 0 && admin) {
    await CareArticle.create({
      title: 'A Complete Guide to Feeding Your Dog',
      category: 'feeding',
      summary: 'Learn the basics of balanced nutrition for adult dogs.',
      content: 'A balanced diet is essential for your dog\'s health... Provide high-quality protein, healthy fats, and the right amount of carbohydrates. Always provide fresh water.',
      author: admin._id,
      tags: ['feeding', 'nutrition', 'dogs'],
      viewCount: 1450,
      coverImage: '/uploads/seed-article-feeding.jpg',
    });
    await CareArticle.create({
      title: 'Grooming Your Cat at Home',
      category: 'grooming',
      summary: 'Step-by-step tips for stress-free home grooming.',
      content: 'Cats groom themselves, but they still need help with brushing, nail trimming, and ear cleaning. Start slowly and reward with treats.',
      author: admin._id,
      tags: ['grooming', 'cats'],
      viewCount: 890,
      coverImage: '/uploads/seed-article-grooming.jpg',
    });
    await CareArticle.create({
      title: 'Why Vaccinations Matter',
      category: 'vaccination',
      summary: 'Understanding the vaccine schedule for puppies and kittens.',
      content: 'Vaccinations protect pets from serious diseases. Follow your veterinarian\'s recommended schedule to keep your pet protected.',
      author: admin._id,
      tags: ['vaccination', 'health'],
      viewCount: 2300,
      coverImage: '/uploads/seed-article-vaccination.jpg',
    });
    console.log('Care articles created');
  } else if (admin) {
    const noCover = await CareArticle.find({ $or: [{ coverImage: { $exists: false } }, { coverImage: { $eq: null } }] });
    const covers = ['/uploads/seed-article-feeding.jpg', '/uploads/seed-article-grooming.jpg', '/uploads/seed-article-vaccination.jpg'];
    for (const a of noCover) {
      await CareArticle.updateOne({ _id: a._id }, { $set: { coverImage: covers[noCover.indexOf(a) % covers.length] } });
      console.log('backfilled cover for', a.title);
    }
  }

  const faqCount = await Faq.countDocuments();
  if (faqCount === 0) {
    await Faq.create([
      { question: 'How often should I take my dog to the vet?', answer: 'Adult dogs should have a wellness check at least once a year. Puppies and senior dogs need more frequent visits.', category: 'health', order: 1 },
      { question: 'How do I book an appointment?', answer: 'Browse veterinarians in your area, select an available time slot, and submit a booking request. The vet will confirm.', category: 'general', order: 2 },
      { question: 'How does adoption work?', answer: 'Browse adoption listings from verified shelters, submit an adoption interest form, and the shelter will guide you through the process.', category: 'adoption', order: 3 },
      { question: 'What should I feed my new puppy?', answer: 'Start with the same food they were eating before, and transition slowly. Consult your vet for specific dietary advice.', category: 'feeding', order: 4 },
    ]);
    console.log('FAQs created');
  }

  const videoCount = await Video.countDocuments();
  if (videoCount === 0) {
    await Video.create([
      { title: 'How to Brush Your Dog\'s Teeth', description: 'A quick guide to oral care for dogs.', category: 'hygiene', url: 'https://www.youtube.com/embed/example1', duration: 180, viewCount: 540 },
      { title: 'Basic Puppy Training Commands', description: 'Sit, stay, and come - the essentials.', category: 'exercise', url: 'https://www.youtube.com/embed/example2', duration: 420, viewCount: 980 },
      { title: 'Signs Your Cat Is Sick', description: 'Know when to visit the vet.', category: 'general', url: 'https://www.youtube.com/embed/example3', duration: 300, viewCount: 760 },
    ]);
    console.log('Videos created');
  }
};

const seed = async () => {
<<<<<<< HEAD
  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to seed: NODE_ENV is "production".');
    process.exit(1);
  }

=======
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
  try {
    await connect();
    await createAdmin();
    await createSampleUsers();
    const categories = await createCategories();
    await createProducts(categories);
    await createSamplePetsAndAdoptions();
    await createCareContent();
    console.log('Seeding complete');
  } catch (error) {
    console.error('Seeding error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();