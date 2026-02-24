import { Navigate } from 'react-router-dom';
import { getUserRole } from '../services/authUtils';

function RoleProtectedRoute({ allowedRole, children }) {
  const role = getUserRole();

  console.log("Current Role:", role);

  if (!role) {
    console.log("No role found → redirecting");
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    console.log("Role mismatch → redirecting");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
