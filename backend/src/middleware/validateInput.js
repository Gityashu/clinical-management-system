const { body, validationResult } = require('express-validator');

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

const patientValidationRules = () => {
  return [
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
  ];
};

const appointmentValidationRules = () => {
  return [
    body('patient_id').isInt().withMessage('Valid patient ID required'),
    body('doctor_id').isInt().withMessage('Valid doctor ID required'),
    body('appointment_date').isISO8601().withMessage('Valid date required'),
  ];
};

module.exports = {
  validateInput,
  patientValidationRules,
  appointmentValidationRules,
};
