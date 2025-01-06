// server/routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;