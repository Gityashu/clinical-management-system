const BaseRepository = require('./BaseRepository');

class BillingRepository extends BaseRepository {
  constructor(db) {
    super(db, 'billing');
    this.db = db;
  }

  // Create new billing record
  async create(billingData) {
    const query = `
      INSERT INTO billing 
      (patient_id, appointment_id, description, amount, status, issued_at, paid_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      billingData.patient_id,
      billingData.appointment_id || null,
      billingData.description,
      billingData.amount,
      billingData.status || 'PENDING',
      new Date(),
      billingData.paid_at || null
    ];
    const result = await this.db.query(query, values);
    return result.rows;
  }

  // Get all billing records with filters
  async findAll(filters = {}) {
    let query = `
      SELECT b.*, 
             p.first_name, p.last_name, p.email,
             a.appointment_date, a.reason
      FROM billing b
      LEFT JOIN patients p ON b.patient_id = p.id
      LEFT JOIN appointments a ON b.appointment_id = a.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.patient_id) {
      query += ` AND b.patient_id = $${paramCount}`;
      values.push(filters.patient_id);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND b.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.start_date) {
      query += ` AND b.issued_at >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      query += ` AND b.issued_at <= $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    query += ` ORDER BY b.issued_at DESC`;

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // Get billing by ID
  async findById(id) {
    const query = `
      SELECT b.*, 
             p.first_name, p.last_name, p.email, p.phone,
             a.appointment_date, a.reason
      FROM billing b
      LEFT JOIN patients p ON b.patient_id = p.id
      LEFT JOIN appointments a ON b.appointment_id = a.id
      WHERE b.id = $1
    `;
    const result = await this.db.query(query, [id]);
    return result.rows;
  }

  // Update billing record
  async update(id, updateData) {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      setClause.push(`${this.snakeCase(key)} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    });

    values.push(id);

    const query = `
      UPDATE billing
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // Record payment
  async recordPayment(id, paymentData) {
    const query = `
      UPDATE billing
      SET amount_paid = amount_paid + $1,
          status = CASE 
            WHEN (amount_paid + $1) >= amount THEN 'PAID'
            WHEN (amount_paid + $1) > 0 THEN 'PARTIAL'
            ELSE 'PENDING'
          END,
          paid_at = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const result = await this.db.query(query, [
      paymentData.amount_paid,
      new Date(),
      id
    ]);
    return result.rows;
  }

  // Get billing summary
  async getSummary(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_invoices,
        SUM(amount) as total_amount,
        SUM(COALESCE(amount_paid, 0)) as total_paid,
        SUM(amount - COALESCE(amount_paid, 0)) as total_pending,
        status,
        COUNT(*) as count
      FROM billing
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.start_date) {
      query += ` AND issued_at >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      query += ` AND issued_at <= $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    query += ` GROUP BY status`;

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // Helper: Convert camelCase to snake_case
  snakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

module.exports = BillingRepository;
