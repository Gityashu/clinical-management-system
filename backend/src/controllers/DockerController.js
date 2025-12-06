class DoctorController {
  constructor(doctorService) {
    this.doctorService = doctorService;
  }

  async getAllDoctors(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.doctorService.getAllDoctors(parseInt(page), parseInt(limit));

      res.json({
        success: true,
        message: '✅ Doctors retrieved successfully',
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

  async getDoctor(req, res) {
    try {
      const { id } = req.params;
      const doctor = await this.doctorService.getDoctorById(id);

      res.json({
        success: true,
        message: '✅ Doctor retrieved successfully',
        data: doctor,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getDoctorsByDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      const doctors = await this.doctorService.getDoctorsByDepartment(departmentId);

      res.json({
        success: true,
        message: '✅ Doctors retrieved successfully',
        data: doctors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAvailableDoctors(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: '❌ Date is required',
        });
      }

      const doctors = await this.doctorService.getAvailableDoctors(date);

      res.json({
        success: true,
        message: '✅ Available doctors retrieved successfully',
        data: doctors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = DoctorController;
