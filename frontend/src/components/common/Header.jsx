import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Dropdown, Badge } from 'react-bootstrap';
import { FaSignOutAlt, FaUser, FaBell } from 'react-icons/fa';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'danger',
      doctor: 'primary',
      receptionist: 'info',
      pharmacist: 'success',
    };
    return colors[role] || 'secondary';
  };

  return (
    <Navbar bg="primary" expand="lg" fixed="top" className="header-navbar shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/dashboard" className="fw-bold text-white">
          🏥 Medical Clinic
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-white" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <div className="d-flex align-items-center gap-3">
            {/* Notifications */}
            <button className="btn btn-link text-white position-relative">
              <FaBell size={20} />
              <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                3
              </Badge>
            </button>

            {/* User Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="light" id="userMenu" className="d-flex align-items-center gap-2">
                <FaUser /> {user?.full_name || 'User'}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item disabled className="text-muted">
                  <Badge bg={getRoleBadgeColor(user?.role)}>
                    {user?.role?.toUpperCase()}
                  </Badge>
                </Dropdown.Item>
                <Dropdown.Item disabled className="text-muted small">
                  {user?.email}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
