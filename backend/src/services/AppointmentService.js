class AppointmentService {
  constructor(appointmentRepository, patientRepository, doctorRepository) {
    this.appointmentRepository = appointmentRepository;
    this.patientRepository = patientRepository;
    this.doctorRepository = doctorRepository;
  }

  validateAppointmentData(data) {
    if (!data.patient_id) {
      throw new Error('Patient ID is required');
    }
    if (!data.doctor_id) {
      throw new Error('Doctor ID is required');
    }
    if (!data.appointment_date) {
      throw new Error('Appointment date is required');
    }

    const appointmentDate = new Date(data.appointment_date);
    if (appointmentDate < new Date()) {
      throw new Error('Appointment date must be in the future');
    }
  }

  async bookAppointment(appointmentData) {
    this.validateAppointmentData(appointmentData);

    const patient = await this.patientRepository.getById(appointmentData.patient_id);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const doctor = await this.doctorRepository.getById(appointmentData.doctor_id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    return await this.appointmentRepository.create({
      ...appointmentData,
      status: 'scheduled',
    });
  }

  async getAppointments(patientId = null, doctorId = null, page = 1, limit = 10) {
    return await this.appointmentRepository.getAppointmentsWithDetails(
      patientId,
      doctorId,
      page,
      limit
    );
  }

  async getAppointmentById(appointmentId) {
    const appointment = await this.appointmentRepository.getById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return appointment;
  }

  async updateAppointment(appointmentId, updateData) {
    const appointment = await this.getAppointmentById(appointmentId);
    return await this.appointmentRepository.update(appointmentId, updateData);
  }

  async cancelAppointment(appointmentId) {
    return await this.appointmentRepository.update(appointmentId, {
      status: 'cancelled',
    });
  }

  async getTodayAppointments() {
    return await this.appointmentRepository.getTodayAppointments();
  }

  async getAppointmentStats() {
    return await this.appointmentRepository.getAppointmentStats();
  }
}

module.exports = AppointmentService;
