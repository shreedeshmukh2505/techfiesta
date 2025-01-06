const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const Division = require('../models/Division');
require('dotenv').config({ path: '../.env' });

// Sample data
const teachers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Mathematics",
    subjects: ["Advanced Mathematics", "Physics Mechanics"],
    availability: {
      monday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
      tuesday: ["9:00 AM", "10:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      wednesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
      thursday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
      friday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"]
    }
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Science",
    subjects: ["Chemistry Lab", "Biology"],
    availability: {
      monday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      tuesday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      wednesday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      thursday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      friday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"]
    }
  }
];

const classrooms = [
  {
    roomNumber: "101",
    building: "Main Building",
    floor: 1,
    capacity: 40,
    availability: {
      monday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      tuesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      wednesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      thursday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      friday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    }
  },
  {
    roomNumber: "102",
    building: "Main Building",
    floor: 1,
    capacity: 35,
    availability: {
      monday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      tuesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      wednesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      thursday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      friday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    }
  }
];

const divisions = [
  {
    name: "Division A",
    semester: "Fall 2024",
    availability: {
      monday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      tuesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      wednesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      thursday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      friday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    }
  },
  {
    name: "Division B",
    semester: "Fall 2024",
    availability: {
      monday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      tuesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      wednesday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      thursday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      friday: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    }
  }
];

// Use the MongoDB connection string from your .env file
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/class-scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  insertSampleData();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function insertSampleData() {
  try {
    // Clear existing data
    await Promise.all([
      Teacher.deleteMany({}),
      Classroom.deleteMany({}),
      Division.deleteMany({})
    ]);

    console.log('Existing data cleared');

    // Insert sample data
    const insertedTeachers = await Teacher.insertMany(teachers);
    console.log('Teachers inserted:', insertedTeachers.length);

    const insertedClassrooms = await Classroom.insertMany(classrooms);
    console.log('Classrooms inserted:', insertedClassrooms.length);

    const insertedDivisions = await Division.insertMany(divisions);
    console.log('Divisions inserted:', insertedDivisions.length);

    console.log('Sample data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample data:', error);
    process.exit(1);
  }
} 