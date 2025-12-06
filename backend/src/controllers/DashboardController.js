class DashboardController {
  constructor(pool, patientRepository, appointmentRepository) {
    this.pool = pool;
    this.patientRepository = patientRepository;
    this.appointmentRepository = appointmentRepository;
  }

  async getStats(req, res) {
    try {
      const query = `
        SELECT
          (SELECT COUNT(*) FROM clinic.patients WHERE status = 'active') as total_patients,
          (SELECT COUNT(*) FROM clinic.doctors WHERE status = 'active') as total_doctors,
          (SELECT COUNT(*) FROM clinic.appointments WHERE status = 'scheduled') as scheduled_appointments,
          (SELECT COUNT(*) FROM clinic.billing WHERE payment_status = 'pending') as pending_bills
      `;

      const result = await this.pool.query(query);

      res.json({
        success: true,
        message: '✅ Dashboard statistics retrieved',
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getTodayAppointments(req, res) {
    try {
      const appointments = await this.appointmentRepository.getTodayAppointments();

      res.json({
        success: true,
        message: '✅ Today appointments retrieved',
        data: appointments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getRecentPatients(req, res) {
    try {
      const patients = await this.patientRepository.getRecentPatients(10);

      res.json({
        success: true,
        message: '✅ Recent patients retrieved',
        data: patients,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = DashboardController;
