// server/routes/teachers.js
const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single teacher
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create teacher
router.post('/', async (req, res) => {
    const teacher = new Teacher(req.body);
    try {
        const newTeacher = await teacher.save();
        res.status(201).json(newTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update teacher
router.patch('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        Object.assign(teacher, req.body);
        const updatedTeacher = await teacher.save();
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete teacher
router.delete('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        await teacher.remove();
        res.json({ message: 'Teacher deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const teacher = new Teacher(req.body);
    try {
      console.log('Saving teacher:', req.body);
      const newTeacher = await teacher.save();
      console.log('Teacher saved:', newTeacher);
      res.status(201).json(newTeacher);
    } catch (err) {
      console.error('Error saving teacher:', err);
      res.status(400).json({ message: err.message });
    }
  });
module.exports = router;