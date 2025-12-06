const express = require('express');
const { authMiddleware } = require('./middleware/authMiddleware');

module.exports = (doctorController) => {
  const router = express.Router();

  router.get('/', authMiddleware, (req, res) =>
    doctorController.getAllDoctors(req, res)
  );
  router.get('/:id', authMiddleware, (req, res) =>
    doctorController.getDoctor(req, res)
  );
  router.get('/department/:departmentId', authMiddleware, (req, res) =>
    doctorController.getDoctorsByDepartment(req, res)
  );
  router.get('/available/check', authMiddleware, (req, res) =>
    doctorController.getAvailableDoctors(req, res)
  );

  return router;
};
