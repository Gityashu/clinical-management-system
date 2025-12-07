class BillingController {
  constructor(billingService) {
    this.billingService = billingService;
  }

  // Create billing
  async createBilling(req, res) {
    try {
      const result = await this.billingService.createBilling(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
        error: error.error
      });
    }
  }

  // Get all billings
  async getAllBillings(req, res) {
    try {
      const filters = {
        patient_id: req.query.patient_id,
        status: req.query.status,
        start_date: req.query.start_date,
        end_date: req.query.end_date
      };
      const result = await this.billingService.getAllBillings(filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get billing by ID
  async getBillingById(req, res) {
    try {
      const result = await this.billingService.getBillingById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update billing
  async updateBilling(req, res) {
    try {
      const result = await this.billingService.updateBilling(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Record payment
  async recordPayment(req, res) {
    try {
      const result = await this.billingService.recordPayment(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get summary
  async getBillingSummary(req, res) {
    try {
      const filters = {
        start_date: req.query.start_date,
        end_date: req.query.end_date
      };
      const result = await this.billingService.getBillingSummary(filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete billing
  async deleteBilling(req, res) {
    try {
      const result = await this.billingService.deleteBilling(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = BillingController;
