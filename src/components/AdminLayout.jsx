import { Link } from 'react-router-dom';
import { logoutUser } from '../services/authUtils';

function AdminLayout({ children }) {

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/';
  };

  // ===============================
  // STYLES
  // ===============================

  const layoutStyle = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  };

  const sidebarStyle = {
    width: '240px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '25px 20px',
    display: 'flex',
    flexDirection: 'column'
  };

  const sidebarTitleStyle = {
    marginBottom: '20px'
  };

  const navStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const mainContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    padding: '15px 25px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd'
  };

  const logoutButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const mainContentStyle = {
    padding: '25px',
    flex: 1,
    backgroundColor: '#ffffff'
  };

  // ===============================
  // COMPONENT
  // ===============================

  return (
    <div style={layoutStyle}>

      {/* ===== Sidebar ===== */}
      <aside style={sidebarStyle}>
        <h3 style={sidebarTitleStyle}>Admin Panel</h3>

        <nav style={navStyle}>
          <Link to="/admin" style={linkStyle}>Dashboard</Link>
          <Link to="/admin/teachers" style={linkStyle}>Teachers</Link>
          <Link to="/admin/students" style={linkStyle}>Students</Link>
          <Link to="/admin/classes" style={linkStyle}>Classes</Link>
          <Link to="/admin/enrollments" style={linkStyle}>Enrollments</Link>
        </nav>
      </aside>

      {/* ===== Main Content Area ===== */}
      <div style={mainContainerStyle}>

        {/* Header */}
        <header style={headerStyle}>
          <h2>School Attendance System</h2>
          <button style={logoutButtonStyle} onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main style={mainContentStyle}>
          {children}
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;


