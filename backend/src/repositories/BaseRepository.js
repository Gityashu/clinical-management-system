class BaseRepository {
  constructor(pool, tableName, schema = 'clinic') {
    this.pool = pool;
    this.table = `${schema}.${tableName}`;
    this.schema = schema;
  }

  async query(sql, values = []) {
    try {
      const result = await this.pool.query(sql, values);
      return result.rows;
    } catch (error) {
      console.error(`Query error: ${error.message}`);
      throw error;
    }
  }

  async getAll(page = 1, limit = 10, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      let sql = `SELECT * FROM ${this.table}`;
      const values = [];

      const filterKeys = Object.keys(filters);
      if (filterKeys.length > 0) {
        sql += ' WHERE ';
        sql += filterKeys
          .map((key, index) => {
            values.push(filters[key]);
            return `${key} = $${index + 1}`;
          })
          .join(' AND ');
      }

      sql += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);

      const result = await this.pool.query(sql, values);

      let countSql = `SELECT COUNT(*) as count FROM ${this.table}`;
      const countValues = [];

      if (filterKeys.length > 0) {
        countSql += ' WHERE ';
        countSql += filterKeys
          .map((key, index) => {
            countValues.push(filters[key]);
            return `${key} = $${index + 1}`;
          })
          .join(' AND ');
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

  async getById(id) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE id = $1`,
        [id]
      );
      return result.rows || null;
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

      const sql = `
        INSERT INTO ${this.table} (${keys.join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `;

      const result = await this.pool.query(sql, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const keys = Object.keys(data);
      if (keys.length === 0) {
        throw new Error('No data to update');
      }

      const values = Object.values(data);
      const setClause = keys
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');

      const sql = `
        UPDATE ${this.table}
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${keys.length + 1}
        RETURNING *
      `;

      const result = await this.pool.query(sql, [...values, id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
      return { success: true, message: 'Record deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BaseRepository;
