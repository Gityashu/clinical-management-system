const express = require('express');
const { authMiddleware } = require('./middleware/authMiddleware');

module.exports = (appointmentController) => {
  const router = express.Router();

  router.post('/', authMiddleware, (req, res) =>
    appointmentController.createAppointment(req, res)
  );
  router.get('/', authMiddleware, (req, res) =>
    appointmentController.getAppointments(req, res)
  );
  router.get('/:id', authMiddleware, (req, res) =>
    appointmentController.getAppointment(req, res)
  );
  router.put('/:id', authMiddleware, (req, res) =>
    appointmentController.updateAppointment(req, res)
  );
  router.put('/:id/cancel', authMiddleware, (req, res) =>
    appointmentController.cancelAppointment(req, res)
  );
  router.get('/today/all', authMiddleware, (req, res) =>
    appointmentController.getTodayAppointments(req, res)
  );
  router.get('/stats/all', authMiddleware, (req, res) =>
    appointmentController.getStats(req, res)
  );

  return router;
};
