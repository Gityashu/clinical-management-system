const express = require('express');
const { authMiddleware } = require('./middleware/authMiddleware');

module.exports = (pharmacyController) => {
  const router = express.Router();

  router.get('/medicines', authMiddleware, (req, res) =>
    pharmacyController.getMedicines(req, res)
  );
  router.get('/medicines/:id', authMiddleware, (req, res) =>
    pharmacyController.getMedicine(req, res)
  );
  router.get('/medicines/search/query', authMiddleware, (req, res) =>
    pharmacyController.searchMedicines(req, res)
  );
  router.put('/stock/:id', authMiddleware, (req, res) =>
    pharmacyController.updateStock(req, res)
  );
  router.get('/alerts/low-stock', authMiddleware, (req, res) =>
    pharmacyController.getLowStockAlert(req, res)
  );
  router.get('/alerts/expired', authMiddleware, (req, res) =>
    pharmacyController.getExpiredMedicines(req, res)
  );

  return router;
};
