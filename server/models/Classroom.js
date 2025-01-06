// server/models/Classroom.js
const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  building: {
    type: String,
    required: true,
    trim: true
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 10,
    max: 200
  },
  availability: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String]
  },
  scheduledClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  }]
});

module.exports = mongoose.model('Classroom', classroomSchema);