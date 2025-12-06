const BaseRepository = require('./BaseRepository');

class DoctorRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'doctors');
  }

  async getDoctorWithUser(doctorId) {
    const sql = `
      SELECT d.*, u.full_name, u.email, u.phone, dept.name as department_name
      FROM ${this.table} d
      JOIN clinic.users u ON d.user_id = u.id
      LEFT JOIN clinic.departments dept ON d.department_id = dept.id
      WHERE d.id = $1
    `;
    const result = await this.query(sql, [doctorId]);
    return result || null;
  }

  async getDoctorsByDepartment(departmentId) {
    const sql = `
      SELECT d.*, u.full_name, u.email, u.phone
      FROM ${this.table} d
      JOIN clinic.users u ON d.user_id = u.id
      WHERE d.department_id = $1 AND d.status = 'active'
      ORDER BY u.full_name
    `;
    return await this.query(sql, [departmentId]);
  }

  async getAvailableDoctors(appointmentDate) {
    const sql = `
      SELECT d.*, u.full_name, u.email
      FROM ${this.table} d
      JOIN clinic.users u ON d.user_id = u.id
      WHERE d.status = 'active'
        AND d.id NOT IN (
          SELECT doctor_id FROM clinic.appointments
          WHERE DATE(appointment_date) = $1
            AND status NOT IN ('cancelled', 'no-show')
        )
      ORDER BY u.full_name
    `;
    return await this.query(sql, [appointmentDate]);
  }
}

module.exports = DoctorRepository;
