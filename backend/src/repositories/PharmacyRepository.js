const BaseRepository = require('./BaseRepository');

class PharmacyRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'medicines');
  }

  async getLowStockMedicines() {
    const sql = `
      SELECT * FROM ${this.table}
      WHERE quantity_in_stock <= reorder_level
        AND status = 'active'
      ORDER BY quantity_in_stock ASC
    `;
    return await this.query(sql, []);
  }

  async updateStock(medicineId, quantityChange) {
    const sql = `
      UPDATE ${this.table}
      SET quantity_in_stock = quantity_in_stock + $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await this.query(sql, [quantityChange, medicineId]);
    return result;
  }

  async getExpiredMedicines() {
    const sql = `
      SELECT * FROM ${this.table}
      WHERE expiry_date < CURRENT_DATE
        AND status = 'active'
    `;
    return await this.query(sql, []);
  }

  async searchMedicines(searchTerm, limit = 20) {
    const sql = `
      SELECT * FROM ${this.table}
      WHERE name ILIKE $1
        OR generic_name ILIKE $1
        OR manufacturer ILIKE $1
      ORDER BY name
      LIMIT $2
    `;
    return await this.query(sql, [`%${searchTerm}%`, limit]);
  }

  async getMedicinesInStock(limit = 20, offset = 0) {
    const sql = `
      SELECT * FROM ${this.table}
      WHERE status = 'active'
        AND quantity_in_stock > 0
      ORDER BY name
      LIMIT $1 OFFSET $2
    `;
    return await this.query(sql, [limit, offset]);
  }
}

module.exports = PharmacyRepository;
