-- Insert Sample Departments
INSERT INTO clinic.departments (name, description, budget, status) VALUES
('Cardiology', 'Heart and Cardiovascular Department', 500000, 'active'),
('Orthopedics', 'Bone and Joint Surgery Department', 450000, 'active'),
('Pediatrics', 'Children Health Department', 350000, 'active'),
('Neurology', 'Neurological Disorders Department', 400000, 'active'),
('General Medicine', 'General Medical Services', 300000, 'active')
ON CONFLICT DO NOTHING;

-- Insert Sample Admin User (password: admin123)
-- Use: npm install bcryptjs  then run: const bcrypt = require('bcryptjs'); bcrypt.hashSync('admin123', 10)
INSERT INTO clinic.users (username, email, password_hash, full_name, role, phone, status) VALUES
('admin', 'admin@clinic.local', '$2a$10$abcdefg123456789xyz', 'Admin User', 'admin', '9876543210', 'active'),
('doctor1', 'dr.sharma@clinic.local', '$2a$10$abcdefg123456789xyz', 'Dr. Rajesh Sharma', 'doctor', '9876543211', 'active'),
('doctor2', 'dr.patel@clinic.local', '$2a$10$abcdefg123456789xyz', 'Dr. Priya Patel', 'doctor', '9876543212', 'active'),
('receptionist1', 'reception@clinic.local', '$2a$10$abcdefg123456789xyz', 'Anjali Singh', 'receptionist', '9876543213', 'active'),
('pharmacist1', 'pharmacist@clinic.local', '$2a$10$abcdefg123456789xyz', 'Vikram Pharma', 'pharmacist', '9876543214', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Doctors
INSERT INTO clinic.doctors (user_id, department_id, specialization, license_number, experience_years, consultation_fee) VALUES
((SELECT id FROM clinic.users WHERE username='doctor1'), 1, 'Cardiologist', 'LIC001', 15, 500),
((SELECT id FROM clinic.users WHERE username='doctor2'), 2, 'Orthopedic Surgeon', 'LIC002', 12, 600)
ON CONFLICT DO NOTHING;

-- Insert Sample Medicines
INSERT INTO clinic.medicines (name, generic_name, manufacturer, quantity_in_stock, price, dosage, status) VALUES
('Aspirin', 'Acetylsalicylic Acid', 'Bayer', 100, 50, '500mg', 'active'),
('Ibuprofen', 'Ibuprofen', 'Cipla', 150, 75, '400mg', 'active'),
('Amoxicillin', 'Amoxicillin', 'Antibiotics Inc', 200, 150, '500mg', 'active'),
('Metformin', 'Metformin HCL', 'Diabetes Care', 120, 100, '850mg', 'active'),
('Vitamin D', 'Cholecalciferol', 'Health Plus', 300, 200, '1000IU', 'active')
ON CONFLICT DO NOTHING;

-- Insert Sample Lab Tests
INSERT INTO clinic.lab_tests (test_code, test_name, category, price, description) VALUES
('BP001', 'Blood Pressure', 'General', 100, 'Blood Pressure Monitoring'),
('BT001', 'Blood Test', 'Hematology', 500, 'Complete Blood Count'),
('UR001', 'Urine Analysis', 'Urinalysis', 300, 'Urine Test'),
('ECG001', 'ECG', 'Cardiology', 1000, 'Electrocardiogram'),
('XR001', 'X-Ray', 'Radiology', 1200, 'General X-Ray')
ON CONFLICT DO NOTHING;

-- Insert Sample Patients
INSERT INTO clinic.patients (patient_number, first_name, last_name, email, phone, date_of_birth, gender, blood_group, address, city, state) VALUES
('PAT-20250101-0001', 'Rajesh', 'Kumar', 'rajesh@mail.com', '9876543200', '1980-05-15', 'Male', 'O+', '123 Main St', 'Delhi', 'Delhi'),
('PAT-20250101-0002', 'Priya', 'Verma', 'priya@mail.com', '9876543201', '1990-08-22', 'Female', 'A+', '456 Park Ave', 'Mumbai', 'Maharashtra'),
('PAT-20250101-0003', 'Arun', 'Singh', 'arun@mail.com', '9876543202', '1985-03-10', 'Male', 'B+', '789 Oak Rd', 'Bangalore', 'Karnataka')
ON CONFLICT (email) DO NOTHING;
