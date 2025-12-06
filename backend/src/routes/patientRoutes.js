const express = require('express');
const { authMiddleware } = require('./middleware/authMiddleware');

module.exports = (patientController) => {
  const router = express.Router();

  router.post('/register', authMiddleware, (req, res) =>
    patientController.registerPatient(req, res)
  );
  router.get('/', authMiddleware, (req, res) =>
    patientController.getAllPatients(req, res)
  );
  router.get('/search', authMiddleware, (req, res) =>
    patientController.searchPatients(req, res)
  );
  router.get('/:id', authMiddleware, (req, res) =>
    patientController.getPatient(req, res)
  );
  router.put('/:id', authMiddleware, (req, res) =>
    patientController.updatePatient(req, res)
  );
  router.delete('/:id', authMiddleware, (req, res) =>
    patientController.deletePatient(req, res)
  );

  return router;
};
