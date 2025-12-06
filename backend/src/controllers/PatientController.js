class PatientController {
  constructor(patientService) {
    this.patientService = patientService;
  }

  async registerPatient(req, res) {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        blood_group,
        address,
        city,
        state,
        postal_code,
      } = req.body;

      if (!first_name || !last_name || !phone) {
        return res.status(400).json({
          success: false,
          message: '❌ Required fields: first_name, last_name, phone',
        });
      }

      const patient = await this.patientService.registerNewPatient({
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        blood_group,
        address,
        city,
        state,
        postal_code,
      });

      res.status(201).json({
        success: true,
        message: '✅ Patient registered successfully',
        data: patient,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllPatients(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.patientService.patientRepository.getAll(
        parseInt(page),
        parseInt(limit),
        { status: 'active' }
      );

      res.json({
        success: true,
        message: '✅ Patients retrieved successfully',
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

  async getPatient(req, res) {
    try {
      const { id } = req.params;
      const patient = await this.patientService.getPatientProfile(id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: '❌ Patient not found',
        });
      }

      res.json({
        success: true,
        message: '✅ Patient retrieved successfully',
        data: patient,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async searchPatients(req, res) {
    try {
      const { search } = req.query;

      if (!search) {
        return res.status(400).json({
          success: false,
          message: '❌ Search term is required',
        });
      }

      const patients = await this.patientService.searchPatients(search);

      res.json({
        success: true,
        message: '✅ Search completed',
        data: patients,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const patient = await this.patientService.updatePatientInfo(id, req.body);

      res.json({
        success: true,
        message: '✅ Patient updated successfully',
        data: patient,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deletePatient(req, res) {
    try {
      const { id } = req.params;
      await this.patientService.patientRepository.delete(id);

      res.json({
        success: true,
        message: '✅ Patient deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = PatientController;
