class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: '❌ Email and password are required',
        });
      }

      const result = await this.authService.login(email, password);

      res.json({
        success: true,
        message: '✅ Login successful',
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async register(req, res) {
    try {
      const { username, email, password, fullName, role, phone } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: '❌ Email, password, and full name are required',
        });
      }

      const user = await this.authService.register({
        username,
        email,
        password,
        fullName,
        role,
        phone,
      });

      res.status(201).json({
        success: true,
        message: '✅ User registered successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyToken(req, res) {
    res.json({
      success: true,
      message: '✅ Token is valid',
      user: req.user,
    });
  }
}

module.exports = AuthController;
