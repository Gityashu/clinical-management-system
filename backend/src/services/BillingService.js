class BillingService {
  constructor(billingRepository) {
    this.billingRepository = billingRepository;
  }

  // Create new billing
  async createBilling(billingData) {
    try {
      // Validate input
      if (!billingData.patient_id) {
        throw new Error('Patient ID is required');
      }
      if (!billingData.description) {
        throw new Error('Description is required');
      }
      if (!billingData.amount || billingData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const billing = await this.billingRepository.create(billingData);
      return {
        success: true,
        message: 'Billing record created successfully',
        data: billing
      };
    } catch (error) {
      throw {
        status: 400,
        message: 'Failed to create billing',
        error: error.message
      };
    }
  }

  // Get all billings
  async getAllBillings(filters = {}) {
    try {
      const billings = await this.billingRepository.findAll(filters);
      return {
        success: true,
        data: billings,
        total: billings.length
      };
    } catch (error) {
      throw {
        status: 500,
        message: 'Failed to fetch billings',
        error: error.message
      };
    }
  }

  // Get billing by ID
  async getBillingById(id) {
    try {
      const billing = await this.billingRepository.findById(id);
      if (!billing) {
        throw new Error('Billing record not found');
      }
      return {
        success: true,
        data: billing
      };
    } catch (error) {
      throw {
        status: error.message.includes('not found') ? 404 : 500,
        message: 'Failed to fetch billing',
        error: error.message
      };
    }
  }

  // Update billing
  async updateBilling(id, updateData) {
    try {
      const billing = await this.billingRepository.findById(id);
      if (!billing) {
        throw new Error('Billing record not found');
      }

      const updated = await this.billingRepository.update(id, updateData);
      return {
        success: true,
        message: 'Billing updated successfully',
        data: updated
      };
    } catch (error) {
      throw {
        status: error.message.includes('not found') ? 404 : 500,
        message: 'Failed to update billing',
        error: error.message
      };
    }
  }

  // Record payment
  async recordPayment(id, paymentData) {
    try {
      const billing = await this.billingRepository.findById(id);
      if (!billing) {
        throw new Error('Billing record not found');
      }

      if (!paymentData.amount_paid || paymentData.amount_paid <= 0) {
        throw new Error('Payment amount must be greater than 0');
      }

      const updated = await this.billingRepository.recordPayment(id, paymentData);
      return {
        success: true,
        message: 'Payment recorded successfully',
        data: updated
      };
    } catch (error) {
      throw {
        status: error.message.includes('not found') ? 404 : 400,
        message: 'Failed to record payment',
        error: error.message
      };
    }
  }

  // Get billing summary
  async getBillingSummary(filters = {}) {
    try {
      const summary = await this.billingRepository.getSummary(filters);
      
      // Format summary
      const formatted = {
        total_invoices: 0,
        total_amount: 0,
        total_paid: 0,
        total_pending: 0,
        by_status: {}
      };

      summary.forEach(row => {
        formatted.total_invoices += parseInt(row.count) || 0;
        formatted.total_amount += parseFloat(row.total_amount) || 0;
        formatted.total_paid += parseFloat(row.total_paid) || 0;
        formatted.total_pending += parseFloat(row.total_pending) || 0;
        formatted.by_status[row.status] = row.count;
      });

      return {
        success: true,
        data: formatted
      };
    } catch (error) {
      throw {
        status: 500,
        message: 'Failed to generate summary',
        error: error.message
      };
    }
  }

  // Delete billing
  async deleteBilling(id) {
    try {
      const billing = await this.billingRepository.findById(id);
      if (!billing) {
        throw new Error('Billing record not found');
      }

      if (billing.status !== 'PENDING') {
        throw new Error('Cannot delete billing with payments recorded');
      }

      await this.billingRepository.delete(id);
      return {
        success: true,
        message: 'Billing deleted successfully'
      };
    } catch (error) {
      throw {
        status: error.message.includes('not found') ? 404 : 400,
        message: 'Failed to delete billing',
        error: error.message
      };
    }
  }
}

module.exports = BillingService;
