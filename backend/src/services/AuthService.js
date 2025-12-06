const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(pool) {
    this.pool = pool;
  }

  async login(email, password) {
    try {
      const result = await this.pool.query(
        'SELECT * FROM clinic.users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('❌ Invalid email or password');
      }

      const user = result.rows;

      if (user.status !== 'active') {
        throw new Error('❌ User account is not active');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('❌ Invalid email or password');
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          username: user.username,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
  }

  async register(userData) {
    try {
      // Check if user exists
      const existingUser = await this.pool.query(
        'SELECT id FROM clinic.users WHERE email = $1 OR username = $2',
        [userData.email, userData.username]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('❌ User with this email or username already exists');
      }

      const hashedPassword = await this.hashPassword(userData.password);

      const result = await this.pool.query(
        `INSERT INTO clinic.users (username, email, password_hash, full_name, role, phone, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, username, email, full_name, role`,
        [
          userData.username,
          userData.email,
          hashedPassword,
          userData.fullName,
          userData.role || 'staff',
          userData.phone,
          'active',
        ]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthService;
