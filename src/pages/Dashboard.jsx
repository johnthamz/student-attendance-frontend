import { logoutUser } from '../services/authUtils';

function Dashboard() {
  const handleLogout = () => {
    logoutUser();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Dashboard</h1>
      <p>You are logged in.</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
