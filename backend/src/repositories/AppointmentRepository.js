const BaseRepository = require('./BaseRepository');

class AppointmentRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'appointments');
  }

  async getAppointmentsWithDetails(patientId = null, doctorId = null, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      let sql = `
        SELECT a.*, p.first_name, p.last_name, p.email, p.phone,
          u.full_name as doctor_name, d.specialization
        FROM ${this.table} a
        JOIN clinic.patients p ON a.patient_id = p.id
        JOIN clinic.doctors d ON a.doctor_id = d.id
        JOIN clinic.users u ON d.user_id = u.id
        WHERE 1=1
      `;
      const values = [];

      if (patientId) {
        values.push(patientId);
        sql += ` AND a.patient_id = $${values.length}`;
      }

      if (doctorId) {
        values.push(doctorId);
        sql += ` AND a.doctor_id = $${values.length}`;
      }

      sql += ` ORDER BY a.appointment_date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);

      const result = await this.pool.query(sql, values);

      // Get count
      let countSql = `SELECT COUNT(*) as count FROM ${this.table} WHERE 1=1`;
      const countValues = [];
      if (patientId) {
        countValues.push(patientId);
        countSql += ` AND patient_id = $${countValues.length}`;
      }
      if (doctorId) {
        countValues.push(doctorId);
        countSql += ` AND doctor_id = $${countValues.length}`;
      }

      const countResult = await this.pool.query(countSql, countValues);
      const total = parseInt(countResult.rows.count);

      return {
        data: result.rows,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getUpcomingAppointments(limit = 10) {
    const sql = `
      SELECT a.*, p.first_name, p.last_name, p.patient_number, u.full_name as doctor_name
      FROM ${this.table} a
      JOIN clinic.patients p ON a.patient_id = p.id
      JOIN clinic.doctors d ON a.doctor_id = d.id
      JOIN clinic.users u ON d.user_id = u.id
      WHERE a.appointment_date > CURRENT_TIMESTAMP
        AND a.status = 'scheduled'
      ORDER BY a.appointment_date ASC
      LIMIT $1
    `;
    return await this.query(sql, [limit]);
  }

  async getTodayAppointments() {
    const sql = `
      SELECT a.*, p.first_name, p.last_name, p.patient_number,
        u.full_name as doctor_name, d.specialization
      FROM ${this.table} a
      JOIN clinic.patients p ON a.patient_id = p.id
      JOIN clinic.doctors d ON a.doctor_id = d.id
      JOIN clinic.users u ON d.user_id = u.id
      WHERE DATE(a.appointment_date) = CURRENT_DATE
        AND a.status IN ('scheduled', 'completed')
      ORDER BY a.appointment_date ASC
    `;
    return await this.query(sql, []);
  }

  async getAppointmentStats() {
    const sql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM ${this.table}
      WHERE appointment_date >= CURRENT_DATE - INTERVAL '30 days'
    `;
    const result = await this.query(sql, []);
    return result;
  }
}

module.exports = AppointmentRepository;
