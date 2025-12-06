-- ============================================
-- CLINIC MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================

CREATE SCHEMA IF NOT EXISTS clinic;

-- Users/Staff Table
CREATE TABLE IF NOT EXISTS clinic.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  -- admin, doctor, receptionist, pharmacist, accountant
  status VARCHAR(50) DEFAULT 'active',
  -- active, inactive, suspended
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE IF NOT EXISTS clinic.departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  head_id INT REFERENCES clinic.users(id) ON DELETE SET NULL,
  budget DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS clinic.doctors (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES clinic.users(id) ON DELETE CASCADE,
  department_id INT REFERENCES clinic.departments(id) ON DELETE SET NULL,
  specialization VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  experience_years INT,
  consultation_fee DECIMAL(10, 2),
  availability_status VARCHAR(50) DEFAULT 'available',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE IF NOT EXISTS clinic.patients (
  id SERIAL PRIMARY KEY,
  patient_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  height DECIMAL(5, 2),
  weight DECIMAL(5, 2),
  allergies TEXT,
  medical_history TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS clinic.appointments (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES clinic.patients(id) ON DELETE CASCADE,
  doctor_id INT REFERENCES clinic.doctors(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP NOT NULL,
  appointment_type VARCHAR(50),
  -- consultation, follow-up, emergency
  status VARCHAR(50) DEFAULT 'scheduled',
  -- scheduled, completed, cancelled, no-show
  reason_for_visit TEXT,
  duration_minutes INT DEFAULT 30,
  diagnosis TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Records Table
CREATE TABLE IF NOT EXISTS clinic.medical_records (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES clinic.patients(id) ON DELETE CASCADE,
  appointment_id INT REFERENCES clinic.appointments(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  symptoms TEXT NOT NULL,
  diagnosis TEXT,
  treatment_plan TEXT,
  doctor_notes TEXT,
  doctor_id INT REFERENCES clinic.doctors(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicines/Pharmacy Table
CREATE TABLE IF NOT EXISTS clinic.medicines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  manufacturer VARCHAR(255),
  batch_number VARCHAR(100),
  quantity_in_stock INT DEFAULT 0,
  price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  dosage VARCHAR(100),
  unit VARCHAR(50),
  expiry_date DATE,
  storage_location VARCHAR(100),
  reorder_level INT DEFAULT 20,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE IF NOT EXISTS clinic.prescriptions (
  id SERIAL PRIMARY KEY,
  medical_record_id INT REFERENCES clinic.medical_records(id) ON DELETE CASCADE,
  patient_id INT REFERENCES clinic.patients(id) ON DELETE CASCADE,
  medicine_id INT REFERENCES clinic.medicines(id) ON DELETE RESTRICT,
  doctor_id INT REFERENCES clinic.doctors(id),
  quantity INT NOT NULL,
  dosage_instructions TEXT NOT NULL,
  frequency VARCHAR(100),
  duration_days INT,
  special_instructions TEXT,
  status VARCHAR(50) DEFAULT 'active',
  issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fulfilled_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing Table
CREATE TABLE IF NOT EXISTS clinic.billing (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES clinic.patients(id) ON DELETE CASCADE,
  appointment_id INT REFERENCES clinic.appointments(id) ON DELETE SET NULL,
  bill_number VARCHAR(50) UNIQUE NOT NULL,
  bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  service_type VARCHAR(100),
  consultation_fee DECIMAL(10, 2),
  medicine_charges DECIMAL(10, 2),
  test_charges DECIMAL(10, 2),
  other_charges DECIMAL(10, 2),
  total_amount DECIMAL(12, 2),
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  tax_percent DECIMAL(5, 2) DEFAULT 0,
  net_amount DECIMAL(12, 2),
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE IF NOT EXISTS clinic.payments (
  id SERIAL PRIMARY KEY,
  billing_id INT REFERENCES clinic.billing(id) ON DELETE CASCADE,
  patient_id INT REFERENCES clinic.patients(id),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  reference_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Tests Table
CREATE TABLE IF NOT EXISTS clinic.lab_tests (
  id SERIAL PRIMARY KEY,
  test_code VARCHAR(50) UNIQUE NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2),
  description TEXT,
  sample_required VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Test Orders Table
CREATE TABLE IF NOT EXISTS clinic.lab_test_orders (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES clinic.patients(id) ON DELETE CASCADE,
  test_id INT REFERENCES clinic.lab_tests(id),
  appointment_id INT REFERENCES clinic.appointments(id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expected_result_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  result TEXT,
  result_date TIMESTAMP,
  lab_technician_id INT REFERENCES clinic.users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS clinic.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES clinic.users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  changes JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_patients_phone ON clinic.patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_patient_number ON clinic.patients(patient_number);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON clinic.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_doctors_department ON clinic.doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON clinic.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON clinic.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_patient ON clinic.billing(patient_id);
