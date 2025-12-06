const BaseRepository = require('./BaseRepository');

class PatientRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'patients');
  }

  async getByPatientNumber(patientNumber) {
    const result = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE patient_number = $1`,
      [patientNumber]
    );
    return result.rows || null;
  }

  async searchPatients(searchTerm, limit = 20) {
    const sql = `
      SELECT * FROM ${this.table}
      WHERE first_name ILIKE $1
        OR last_name ILIKE $1
        OR email ILIKE $1
        OR phone ILIKE $1
        OR patient_number ILIKE $1
      LIMIT $2
    `;
    return await this.query(sql, [`%${searchTerm}%`, limit]);
  }

  async generatePatientNumber() {
    const result = await this.pool.query(
      `SELECT COUNT(*) as count FROM ${this.table} WHERE created_at::date = CURRENT_DATE`
    );
    const count = result.rows.count + 1;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `PAT-${date}-${String(count).padStart(4, '0')}`;
  }

  async getPatientWithHistory(patientId) {
    const sql = `
      SELECT p.*,
        json_agg(json_build_object(
          'id', a.id,
          'appointment_date', a.appointment_date,
          'doctor_name', u.full_name,
          'diagnosis', a.diagnosis,
          'status', a.status
        ) ORDER BY a.appointment_date DESC) FILTER (WHERE a.id IS NOT NULL) as appointments
      FROM ${this.table} p
      LEFT JOIN clinic.appointments a ON p.id = a.patient_id
      LEFT JOIN clinic.doctors d ON a.doctor_id = d.id
      LEFT JOIN clinic.users u ON d.user_id = u.id
      WHERE p.id = $1
      GROUP BY p.id
    `;
    const result = await this.query(sql, [patientId]);
    return result || null;
  }

  async getRecentPatients(limit = 10) {
    const sql = `
      SELECT * FROM ${this.table}
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT $1
    `;
    return await this.query(sql, [limit]);
  }
}

module.exports = PatientRepository;
