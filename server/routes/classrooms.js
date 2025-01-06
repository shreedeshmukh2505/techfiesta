// server/routes/classrooms.js
const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');

// Get all classrooms
router.get('/', async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.json(classrooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single classroom
router.get('/:id', async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        res.json(classroom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create classroom
router.post('/', async (req, res) => {
    const classroom = new Classroom(req.body);
    try {
        const newClassroom = await classroom.save();
        res.status(201).json(newClassroom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update classroom
router.patch('/:id', async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        Object.assign(classroom, req.body);
        const updatedClassroom = await classroom.save();
        res.json(updatedClassroom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete classroom
router.delete('/:id', async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        await classroom.remove();
        res.json({ message: 'Classroom deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;