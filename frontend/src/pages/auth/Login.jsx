import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('admin@clinic.local');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col lg={5} md={8} xs={12} className="mx-auto">
          <Card className="login-card shadow-lg border-0">
            <Card.Body className="p-5">
              {/* Logo Section */}
              <div className="text-center mb-5">
                <div className="clinic-logo">🏥</div>
                <h2 className="text-primary fw-bold mt-3">Medical Clinic</h2>
                <p className="text-muted">Management System</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    size="lg"
                  />
                  <Form.Text className="text-muted small d-block mt-2">
                    Demo: admin@clinic.local
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    size="lg"
                  />
                  <Form.Text className="text-muted small d-block mt-2">
                    Demo: admin123
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </Form>

              <hr className="my-4" />

              {/* Footer Info */}
              <div className="text-center">
                <p className="text-muted small mb-1">
                  🔐 Secure Authentication with JWT
                </p>
                <p className="text-muted small mb-0">
                  3-Tier Architecture Implementation
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Info Cards */}
          <Row className="mt-4">
            <Col md={6} xs={12} className="mb-2">
              <Card className="info-card text-center bg-light border-0">
                <Card.Body className="py-3">
                  <p className="small mb-1">Backend</p>
                  <p className="fw-bold small">Node.js + Express</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <Card className="info-card text-center bg-light border-0">
                <Card.Body className="py-3">
                  <p className="small mb-1">Database</p>
                  <p className="fw-bold small">PostgreSQL + pgAdmin</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
