class AppointmentController {
  constructor(appointmentService) {
    this.appointmentService = appointmentService;
  }

  async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      const appointment = await this.appointmentService.bookAppointment(appointmentData);

      res.status(201).json({
        success: true,
        message: '✅ Appointment booked successfully',
        data: appointment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAppointments(req, res) {
    try {
      const { page = 1, limit = 10, patientId, doctorId } = req.query;
      const result = await this.appointmentService.getAppointments(
        patientId ? parseInt(patientId) : null,
        doctorId ? parseInt(doctorId) : null,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        message: '✅ Appointments retrieved successfully',
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

  async getAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointment = await this.appointmentService.getAppointmentById(id);

      res.json({
        success: true,
        message: '✅ Appointment retrieved successfully',
        data: appointment,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointment = await this.appointmentService.updateAppointment(id, req.body);

      res.json({
        success: true,
        message: '✅ Appointment updated successfully',
        data: appointment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointment = await this.appointmentService.cancelAppointment(id);

      res.json({
        success: true,
        message: '✅ Appointment cancelled successfully',
        data: appointment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getTodayAppointments(req, res) {
    try {
      const appointments = await this.appointmentService.getTodayAppointments();

      res.json({
        success: true,
        message: '✅ Today appointments retrieved successfully',
        data: appointments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await this.appointmentService.getAppointmentStats();

      res.json({
        success: true,
        message: '✅ Appointment statistics retrieved',
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = AppointmentController;
