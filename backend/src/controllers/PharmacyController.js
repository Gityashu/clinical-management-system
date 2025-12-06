class PharmacyController {
  constructor(pharmacyService) {
    this.pharmacyService = pharmacyService;
  }

  async getMedicines(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await this.pharmacyService.getAllMedicines(parseInt(page), parseInt(limit));

      res.json({
        success: true,
        message: '✅ Medicines retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMedicine(req, res) {
    try {
      const { id } = req.params;
      const medicine = await this.pharmacyService.getMedicineById(id);

      res.json({
        success: true,
        message: '✅ Medicine retrieved successfully',
        data: medicine,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async searchMedicines(req, res) {
    try {
      const { search } = req.query;

      if (!search) {
        return res.status(400).json({
          success: false,
          message: '❌ Search term is required',
        });
      }

      const medicines = await this.pharmacyService.searchMedicines(search);

      res.json({
        success: true,
        message: '✅ Search completed',
        data: medicines,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity) {
        return res.status(400).json({
          success: false,
          message: '❌ Quantity is required',
        });
      }

      const medicine = await this.pharmacyService.updateStock(id, parseInt(quantity));

      res.json({
        success: true,
        message: '✅ Stock updated successfully',
        data: medicine,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getLowStockAlert(req, res) {
    try {
      const medicines = await this.pharmacyService.getLowStockAlert();

      res.json({
        success: true,
        message: '✅ Low stock medicines retrieved',
        data: medicines,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getExpiredMedicines(req, res) {
    try {
      const medicines = await this.pharmacyService.getExpiredMedicines();

      res.json({
        success: true,
        message: '✅ Expired medicines retrieved',
        data: medicines,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = PharmacyController;
