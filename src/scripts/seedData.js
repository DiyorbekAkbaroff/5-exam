import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/avto-salon');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedCars = async () => {
  try {
    // Clear existing cars
    await Car.deleteMany({});
    
    const cars = [
      {
        brand: 'Chevrolet',
        model: 'Tahoe',
        year: 2022,
        price: 329900000,
        engine: '5.3L V8',
        color: 'Oq',
        distance: 0,
        gearbox: 'Avtomat karobka',
        tinting: 'Yo\'q',
        description: 'Yangi Chevrolet Tahoe, to\'liq jihozlangan',
        images: {
          exterior: '/assets/images/chevrolet.jpg',
          interior: '/assets/images/chevrolet.jpg',
          modelType: '/assets/images/chevrolet.jpg'
        }
      },
      {
        brand: 'Chevrolet',
        model: 'Damas',
        year: 2021,
        price: 189900000,
        engine: '0.8L',
        color: 'Oq',
        distance: 15000,
        gearbox: 'Mexanik karobka',
        tinting: 'Yo\'q',
        description: 'Chevrolet Damas, biznes uchun ideal',
        images: {
          exterior: '/assets/images/chevrolet.jpg',
          interior: '/assets/images/chevrolet.jpg',
          modelType: '/assets/images/chevrolet.jpg'
        }
      },
      {
        brand: 'Chevrolet',
        model: 'Equinox',
        year: 2023,
        price: 459900000,
        engine: '1.5L Turbo',
        color: 'Kulrang',
        distance: 5000,
        gearbox: 'Avtomat karobka',
        tinting: 'Ha',
        description: 'Chevrolet Equinox, zamonaviy dizayn',
        images: {
          exterior: '/assets/images/chevrolet.jpg',
          interior: '/assets/images/chevrolet.jpg',
          modelType: '/assets/images/chevrolet.jpg'
        }
      },
      {
        brand: 'Chevrolet',
        model: 'Nexia',
        year: 2019,
        price: 159900000,
        engine: '1.5L',
        color: 'Oq',
        distance: 45000,
        gearbox: 'Mexanik karobka',
        tinting: 'Yo\'q',
        description: 'Chevrolet Nexia, ishonchli va tejamli',
        images: {
          exterior: '/assets/images/chevrolet.jpg',
          interior: '/assets/images/chevrolet.jpg',
          modelType: '/assets/images/chevrolet.jpg'
        }
      },
      {
        brand: 'Chevrolet',
        model: 'Malibu',
        year: 2016,
        price: 329900000,
        engine: '1.6L',
        color: 'Oq',
        distance: 30000,
        gearbox: 'Avtomat karobka',
        tinting: 'Yo\'q',
        description: 'Mishina ideal holatda krasska top toza 100tali. Ayol kishiniki judayam akuratno haydalgan.',
        images: {
          exterior: '/assets/images/chevrolet.jpg',
          interior: '/assets/images/chevrolet.jpg',
          modelType: '/assets/images/chevrolet.jpg'
        }
      },
      {
        brand: 'Lada',
        model: 'Granta',
        year: 2020,
        price: 189900000,
        engine: '1.6L',
        color: 'Kulrang',
        distance: 25000,
        gearbox: 'Mexanik karobka',
        tinting: 'Yo\'q',
        description: 'Lada Granta, Rossiya ishlab chiqarish',
        images: {
          exterior: '/assets/images/lada.jpg',
          interior: '/assets/images/lada.jpg',
          modelType: '/assets/images/lada.jpg'
        }
      },
      {
        brand: 'Lamborghini',
        model: 'Huracan',
        year: 2023,
        price: 2500000000,
        engine: '5.2L V10',
        color: 'Ko\'k',
        distance: 1000,
        gearbox: 'Avtomat karobka',
        tinting: 'Ha',
        description: 'Lamborghini Huracan, super sport avtomobil',
        images: {
          exterior: '/assets/images/lamborghini.jpg',
          interior: '/assets/images/lamborghini.jpg',
          modelType: '/assets/images/lamborghini.jpg'
        }
      },
      {
        brand: 'Ferrari',
        model: 'F8 Tributo',
        year: 2022,
        price: 3200000000,
        engine: '3.9L V8 Twin-Turbo',
        color: 'Sariq',
        distance: 500,
        gearbox: 'Avtomat karobka',
        tinting: 'Ha',
        description: 'Ferrari F8 Tributo, Italiya ishlab chiqarish',
        images: {
          exterior: '/assets/images/ferrari.jpg',
          interior: '/assets/images/ferrari.jpg',
          modelType: '/assets/images/ferrari.jpg'
        }
      }
    ];
    
    await Car.insertMany(cars);
    console.log('✅ Cars seeded successfully');
    
  } catch (error) {
    console.error('Error seeding cars:', error);
  }
};

const seedAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@avtosalon.uz' });
    
    if (!existingAdmin) {
      const adminUser = new User({
        email: 'admin@avtosalon.uz',
        password: 'admin123',
        name: 'Admin User',
        phone: '+998901234567',
        role: 'admin',
        isVerified: true
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

const runSeed = async () => {
  try {
    await connectDB();
    await seedCars();
    await seedAdminUser();
    
    console.log('🎉 Database seeding completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

runSeed(); 