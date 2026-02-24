import { getUserRole } from '../services/authUtils';
import { useState } from 'react';
import { loginUser } from '../services/authService';
import './Login.css';
import logo from '../assets/school-logo.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(username, password);

       localStorage.setItem('accessToken', data.access);
       localStorage.setItem('refreshToken', data.refresh);

       const role = getUserRole();

       if (role === 'admin') {
          window.location.href = '/admin';
       } else {
          window.location.href = '/teacher';
}


      // Temporary success confirmation
      alert('Login successful');

      // Redirect (temporary)
      window.location.href = '/dashboard';


    } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        setError(
        err.response?.data?.detail ||
        'Login failed. Check console for details.');

    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="School Logo" className="login-logo" />
        <h2>Student Attendance System</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
