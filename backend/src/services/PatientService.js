class PatientService {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  validatePatientData(data) {
    if (!data.first_name || !data.first_name.trim()) {
      throw new Error('❌ First name is required');
    }
    if (!data.last_name || !data.last_name.trim()) {
      throw new Error('❌ Last name is required');
    }
    if (!data.phone || !data.phone.trim()) {
      throw new Error('❌ Phone number is required');
    }

    if (!this.isValidPhone(data.phone)) {
      throw new Error('❌ Invalid phone number format');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('❌ Invalid email format');
    }
  }

  isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async registerNewPatient(patientData) {
    this.validatePatientData(patientData);

    const patientNumber = await this.patientRepository.generatePatientNumber();

    const newPatient = {
      ...patientData,
      patient_number: patientNumber,
      status: 'active',
    };

    return await this.patientRepository.create(newPatient);
  }

  async getPatientProfile(patientId) {
    return await this.patientRepository.getPatientWithHistory(patientId);
  }

  async searchPatients(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Search term must be at least 2 characters');
    }
    return await this.patientRepository.searchPatients(searchTerm);
  }

  async updatePatientInfo(patientId, patientData) {
    this.validatePatientData(patientData);
    return await this.patientRepository.update(patientId, patientData);
  }

  async updatePatientStatus(patientId, status) {
    const validStatuses = ['active', 'inactive', 'transferred'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    return await this.patientRepository.update(patientId, { status });
  }
}

module.exports = PatientService;
