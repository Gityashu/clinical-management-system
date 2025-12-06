const express = require('express');
const { authMiddleware } = require('./middleware/authMiddleware');

module.exports = (authController) => {
  const router = express.Router();

  router.post('/login', (req, res) => authController.login(req, res));
  router.post('/register', (req, res) => authController.register(req, res));
  router.get('/verify', authMiddleware, (req, res) => authController.verifyToken(req, res));

  return router;
};
