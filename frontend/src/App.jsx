import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';

// Dashboard & Main Pages
import Dashboard from './pages/dashboard/Dashboard';
import PatientList from './pages/patients/PatientList';
import PatientAdd from './pages/patients/PatientAdd';
import PatientDetail from './pages/patients/PatientDetail';

import DoctorList from './pages/doctors/DoctorList';
import AppointmentList from './pages/appointments/AppointmentList';
import BookAppointment from './pages/appointments/BookAppointment';

import MedicineList from './pages/pharmacy/MedicineList';
import StockManagement from './pages/pharmacy/StockManagement';

import BillingList from './pages/billing/BillingList';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/add"
            element={
              <ProtectedRoute>
                <PatientAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute>
                <PatientDetail />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <DoctorList />
              </ProtectedRoute>
            }
          />

          {/* Appointment Routes */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/book"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          {/* Pharmacy Routes */}
          <Route
            path="/pharmacy/medicines"
            element={
              <ProtectedRoute>
                <MedicineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/stock"
            element={
              <ProtectedRoute>
                <StockManagement />
              </ProtectedRoute>
            }
          />

          {/* Billing Routes */}
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingList />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
