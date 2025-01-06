const express = require('express');
const router = express.Router();
const Division = require('../models/Division');

// Create division
router.post('/', async (req, res) => {
  try {
    const division = new Division(req.body);
    const savedDivision = await division.save();
    res.status(201).json(savedDivision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all divisions
router.get('/', async (req, res) => {
  try {
    const divisions = await Division.find();
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 