// server/models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  availability: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String]
  },
  preferences: {
    maxClassesPerDay: {
      type: Number,
      default: 4
    },
    preferredTimeSlots: [String],
    breakTime: String
  },
  assignedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  maxConsecutiveSlots: { type: Number, default: 3 },
  breakPreferences: [String],
  subjectLoadPerWeek: {
    type: Map,
    of: Number
  },
  preferredRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
  conflictTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }]
});

module.exports = mongoose.model('Teacher', teacherSchema);