// server/models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    dayOfWeek: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    scheduleType: {
        type: String,
        default: 'division'
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema);