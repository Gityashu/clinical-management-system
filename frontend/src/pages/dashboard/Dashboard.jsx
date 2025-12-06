import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { FaUsers, FaCalendarAlt, FaStethoscope, FaFileInvoice } from 'react-icons/fa';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, appointmentsRes, patientsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getTodayAppointments(),
        dashboardAPI.getRecentPatients(),
      ]);

      setStats(statsRes.data.data);
      setTodayAppointments(appointmentsRes.data.data || []);
      setRecentPatients(patientsRes.data.data || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="d-flex">
          <Sidebar />
          <Container fluid className="p-4 flex-grow-1">
            <Spinner animation="border" className="mt-5" />
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar />
        <Container fluid className="p-4 flex-grow-1 dashboard-main">
          {/* Header */}
          <div className="mb-5">
            <h1 className="fw-bold">📊 Dashboard</h1>
            <p className="text-muted">
              Welcome back, <strong>{user?.full_name}</strong>! 
              <span className="ms-2 badge bg-info">{user?.role?.toUpperCase()}</span>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {/* Statistics Cards */}
          {stats && (
            <Row className="mb-5">
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card className="stat-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted small mb-2">Total Patients</p>
                        <h2 className="text-primary fw-bold">{stats.total_patients || 0}</h2>
                      </div>
                      <FaUsers className="stat-icon text-primary" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card className="stat-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted small mb-2">Today's Appointments</p>
                        <h2 className="text-success fw-bold">{todayAppointments.length}</h2>
                      </div>
                      <FaCalendarAlt className="stat-icon text-success" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card className="stat-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted small mb-2">Total Doctors</p>
                        <h2 className="text-info fw-bold">{stats.total_doctors || 0}</h2>
                      </div>
                      <FaStethoscope className="stat-icon text-info" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card className="stat-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted small mb-2">Pending Bills</p>
                        <h2 className="text-warning fw-bold">{stats.pending_bills || 0}</h2>
                      </div>
                      <FaFileInvoice className="stat-icon text-warning" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Today's Appointments */}
          <Row className="mb-5">
            <Col lg={8} xs={12}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">📅 Today's Appointments</h5>
                </Card.Header>
                <Card.Body>
                  {todayAppointments.length === 0 ? (
                    <p className="text-muted text-center py-3">No appointments scheduled for today</p>
                  ) : (
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todayAppointments.map((apt) => (
                            <tr key={apt.id}>
                              <td className="fw-bold">{apt.first_name} {apt.last_name}</td>
                              <td>{apt.doctor_name}</td>
                              <td>{new Date(apt.appointment_date).toLocaleTimeString()}</td>
                              <td className="text-capitalize">{apt.appointment_type}</td>
                              <td>
                                <span className={`badge bg-${apt.status === 'scheduled' ? 'info' : 'success'}`}>
                                  {apt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Patients */}
            <Col lg={4} xs={12}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">👥 Recent Patients</h5>
                </Card.Header>
                <Card.Body>
                  {recentPatients.length === 0 ? (
                    <p className="text-muted text-center py-3">No recent patients</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {recentPatients.map((patient) => (
                        <div key={patient.id} className="list-group-item px-0 py-3 border-bottom">
                          <p className="fw-bold mb-1">{patient.first_name} {patient.last_name}</p>
                          <p className="small text-muted mb-0">{patient.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
