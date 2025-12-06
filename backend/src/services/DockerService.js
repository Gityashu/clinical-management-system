class DoctorService {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async getAllDoctors(page = 1, limit = 10) {
    return await this.doctorRepository.getAll(page, limit, { status: 'active' });
  }

  async getDoctorById(doctorId) {
    const doctor = await this.doctorRepository.getDoctorWithUser(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    return doctor;
  }

  async getDoctorsByDepartment(departmentId) {
    return await this.doctorRepository.getDoctorsByDepartment(departmentId);
  }

  async getAvailableDoctors(appointmentDate) {
    return await this.doctorRepository.getAvailableDoctors(appointmentDate);
  }
}

module.exports = DoctorService;
