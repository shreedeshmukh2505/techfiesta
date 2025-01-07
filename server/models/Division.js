const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  availability: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String]
  },
  semester: {
    type: String,
    required: true
  },
  assignedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  preferredDays: [String],
  subjectPreferences: [{
    subject: String,
    preferredSlots: [String],
    preferredTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }]
  }],
  consecutiveSlotLimit: { type: Number, default: 3 },
  dailySubjectLimit: { type: Number, default: 6 },
  breakPreferences: [String]
});

module.exports = mongoose.model('Division', divisionSchema); 