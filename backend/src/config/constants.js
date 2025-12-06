const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  PHARMACIST: 'pharmacist',
  ACCOUNTANT: 'accountant',
};

const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
};

const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  FOLLOW_UP: 'follow-up',
  EMERGENCY: 'emergency',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
};

const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
  CHEQUE: 'cheque',
};

module.exports = {
  ROLES,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
};
