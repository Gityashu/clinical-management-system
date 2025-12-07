const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (billingController) => {
  // All routes require authentication
  router.use(authMiddleware);

  // Create billing
  router.post('/', (req, res) => billingController.createBilling(req, res));

  // Get all billings (with filters)
  router.get('/', (req, res) => billingController.getAllBillings(req, res));

  // Get summary/report
  router.get('/summary/report', (req, res) => billingController.getBillingSummary(req, res));

  // Get billing by ID
  router.get('/:id', (req, res) => billingController.getBillingById(req, res));

  // Update billing
  router.put('/:id', (req, res) => billingController.updateBilling(req, res));

  // Record payment
  router.post('/:id/payment', (req, res) => billingController.recordPayment(req, res));

  // Delete billing
  router.delete('/:id', (req, res) => billingController.deleteBilling(req, res));

  return router;
};
