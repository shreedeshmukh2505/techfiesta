// server/routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const data = await analyticsService.getDashboardData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get detailed resource utilization
router.get('/utilization', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await analyticsService.getUtilizationStats(startDate, endDate);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get teacher statistics
router.get('/teachers', async (req, res) => {
  try {
    const data = await analyticsService.getTeacherStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get classroom statistics
router.get('/classrooms', async (req, res) => {
  try {
    const data = await analyticsService.getRoomStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student statistics
router.get('/students', async (req, res) => {
  try {
    const data = await analyticsService.getStudentStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate optimization recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const insights = await analyticsService.generateInsights();
    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export analytics data
router.get('/export', async (req, res) => {
  try {
    const { format } = req.query;
    const data = await analyticsService.exportAnalytics(format);

    if (format === 'csv') {
      res.header('Content-Type', 'text/csv');
      res.attachment('schedule_analytics.csv');
      res.send(data);
    } else {
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific date range analytics
router.get('/daterange', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await analyticsService.getDateRangeAnalytics(startDate, endDate);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get comparison analytics between two periods
router.get('/compare', async (req, res) => {
  try {
    const { period1Start, period1End, period2Start, period2End } = req.query;
    const data = await analyticsService.comparePeriodsAnalytics(
      period1Start, period1End, 
      period2Start, period2End
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;