const mongoose = require('mongoose');
const Division = require('../models/Division');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const Schedule = require('../models/Schedule');

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const generateAvailability = () => {
  const availability = {};
  days.forEach(day => {
    availability[day] = timeSlots;
  });
  return availability;
};

const seedData = {
  divisions: [
    {
      name: 'CSE-A',
      semester: 'Fall 2024',
      subjects: ['Advanced Mathematics', 'Data Structures', 'Computer Networks', 'Database Systems'],
      availability: generateAvailability()
    },
    {
      name: 'CSE-B',
      semester: 'Fall 2024',
      subjects: ['Advanced Mathematics', 'Data Structures', 'Computer Networks', 'Database Systems'],
      availability: generateAvailability()
    },
    {
      name: 'IT-A',
      semester: 'Fall 2024',
      subjects: ['Web Development', 'Operating Systems', 'Software Engineering', 'Cloud Computing'],
      availability: generateAvailability()
    },
    {
      name: 'ECE-A',
      semester: 'Fall 2024',
      subjects: ['Digital Electronics', 'Circuit Theory', 'Signals and Systems', 'Microprocessors'],
      availability: generateAvailability()
    },
    {
      name: 'MECH-A',
      semester: 'Fall 2024',
      subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Engineering Materials'],
      availability: generateAvailability()
    }
  ],

  teachers: [
    {
      name: 'Dr. John Smith',
      email: 'john.smith@university.edu',
      department: 'Computer Science',
      subjects: ['Advanced Mathematics', 'Data Structures'],
      availability: generateAvailability(),
      preferences: {
        maxClassesPerDay: 4,
        preferredTimeSlots: ['9:00 AM', '10:00 AM', '11:00 AM'],
        breakTime: '1:00 PM'
      }
    },
    {
      name: 'Prof. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      department: 'Computer Science',
      subjects: ['Computer Networks', 'Operating Systems'],
      availability: generateAvailability(),
      preferences: {
        maxClassesPerDay: 4,
        preferredTimeSlots: ['1:00 PM', '2:00 PM', '3:00 PM'],
        breakTime: '12:00 PM'
      }
    },
    {
      name: 'Dr. Michael Chen',
      email: 'michael.chen@university.edu',
      department: 'Computer Science',
      subjects: ['Database Systems', 'Software Engineering'],
      availability: generateAvailability(),
      preferences: {
        maxClassesPerDay: 3,
        preferredTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM'],
        breakTime: '2:00 PM'
      }
    },
    {
      name: 'Prof. Emily Brown',
      email: 'emily.brown@university.edu',
      department: 'Information Technology',
      subjects: ['Web Development', 'Cloud Computing'],
      availability: generateAvailability(),
      preferences: {
        maxClassesPerDay: 4,
        preferredTimeSlots: ['2:00 PM', '3:00 PM', '4:00 PM'],
        breakTime: '12:00 PM'
      }
    },
    {
      name: 'Dr. Robert Wilson',
      email: 'robert.wilson@university.edu',
      department: 'Electronics',
      subjects: ['Digital Electronics', 'Microprocessors'],
      availability: generateAvailability(),
      preferences: {
        maxClassesPerDay: 3,
        preferredTimeSlots: ['9:00 AM', '10:00 AM', '2:00 PM'],
        breakTime: '12:00 PM'
      }
    },
    {
      name: 'Prof. David Lee',
      email: 'david.lee@university.edu',
      department: 'Mechanical',
      subjects: ['Thermodynamics', 'Fluid Mechanics'],
      availability: generateAvailability(),
      preferences: {
        maxClassesPerDay: 4,
        preferredTimeSlots: ['11:00 AM', '12:00 PM', '2:00 PM'],
        breakTime: '1:00 PM'
      }
    }
  ],

  classrooms: [
    {
      roomNumber: '101',
      building: 'Engineering Block A',
      floor: 1,
      capacity: 70,
      availability: generateAvailability()
    },
    {
      roomNumber: '102',
      building: 'Engineering Block A',
      floor: 1,
      capacity: 70,
      availability: generateAvailability()
    },
    {
      roomNumber: '201',
      building: 'Engineering Block A',
      floor: 2,
      capacity: 60,
      availability: generateAvailability()
    },
    {
      roomNumber: '202',
      building: 'Engineering Block A',
      floor: 2,
      capacity: 60,
      availability: generateAvailability()
    },
    {
      roomNumber: 'L101',
      building: 'Engineering Block B',
      floor: 1,
      capacity: 40,
      availability: generateAvailability()
    },
    {
      roomNumber: 'L102',
      building: 'Engineering Block B',
      floor: 1,
      capacity: 40,
      availability: generateAvailability()
    }
  ]
};

async function seedDatabase() {
  try {
    // Clear existing data
    await Promise.all([
      Division.deleteMany({}),
      Teacher.deleteMany({}),
      Classroom.deleteMany({}),
      Schedule.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert new data
    await Promise.all([
      Division.insertMany(seedData.divisions),
      Teacher.insertMany(seedData.teachers),
      Classroom.insertMany(seedData.classrooms)
    ]);
    console.log('Inserted new data');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Connect to MongoDB and seed data
mongoose.connect('mongodb://localhost:27017/class-scheduler')
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDatabase();
  })
  .catch(error => {
    console.error('Database connection error:', error);
  }); 