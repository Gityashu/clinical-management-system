import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome, FaUsers, FaCalendarAlt, FaStethoscope,
  FaPills, FaFileInvoice, FaBars, FaTimes
} from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome, roles: ['admin', 'doctor', 'receptionist', 'pharmacist'] },
    { path: '/patients', label: 'Patients', icon: FaUsers, roles: ['admin', 'doctor', 'receptionist'] },
    { path: '/doctors', label: 'Doctors', icon: FaStethoscope, roles: ['admin', 'receptionist'] },
    { path: '/appointments', label: 'Appointments', icon: FaCalendarAlt, roles: ['admin', 'doctor', 'receptionist'] },
    { path: '/pharmacy/medicines', label: 'Pharmacy', icon: FaPills, roles: ['admin', 'pharmacist', 'doctor'] },
    { path: '/billing', label: 'Billing', icon: FaFileInvoice, roles: ['admin', 'receptionist'] },
  ];

  const filteredItems = menuItems.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? <FaBars /> : <FaTimes />}
      </button>

      <nav className="sidebar-nav">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <Icon className="sidebar-icon" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
