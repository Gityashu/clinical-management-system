const express = require('express');
const { authMiddleware } = require('./middleware/authMiddleware');

module.exports = (dashboardController) => {
  const router = express.Router();

  router.get('/stats', authMiddleware, (req, res) =>
    dashboardController.getStats(req, res)
  );
  router.get('/today-appointments', authMiddleware, (req, res) =>
    dashboardController.getTodayAppointments(req, res)
  );
  router.get('/recent-patients', authMiddleware, (req, res) =>
    dashboardController.getRecentPatients(req, res)
  );

  return router;
};
