import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import EmergencyReport from './models/EmergencyReport.js';
import Shelter from './models/Shelter.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await EmergencyReport.deleteMany();
    await Shelter.deleteMany();

    console.log('Data Cleared...');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
      phone: '1234567890'
    });

    // Create Volunteer
    const volunteer = await User.create({
      name: 'Volunteer User',
      email: 'volunteer@example.com',
      password: 'password123',
      role: 'Volunteer',
      phone: '0987654321'
    });

    // Create Citizen
    const citizen = await User.create({
      name: 'Citizen User',
      email: 'citizen@example.com',
      password: 'password123',
      role: 'Citizen',
      phone: '5555555555'
    });

    // Create Emergencies
    await EmergencyReport.create([
      {
        title: 'Flash Flood in Sector 7',
        description: 'Water level rising rapidly near the main bridge.',
        disasterType: 'Flood',
        severity: 'Critical',
        location: {
          type: 'Point',
          coordinates: [78.9629, 20.5937],
          address: 'Sector 7, Main Bridge'
        },
        reportedBy: citizen._id,
        status: 'Reported'
      },
      {
        title: 'Building Collapse after Tremors',
        description: 'Old apartment building partially collapsed.',
        disasterType: 'Earthquake',
        severity: 'Critical',
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139],
          address: 'Delhi Central'
        },
        reportedBy: citizen._id,
        status: 'Ongoing'
      }
    ]);

    // Create Shelters
    await Shelter.create([
      {
        shelterName: 'Central Shelter',
        location: { address: '123 Rescue Way' },
        geoLocation: {
          type: 'Point',
          coordinates: [78.9000, 20.5000]
        },
        capacity: 500,
        availability: 250,
        status: 'Open'
      }
    ]);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
