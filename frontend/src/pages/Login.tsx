// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../src/components/AuthContext';
import '../styles/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:7000/api/auth/login', {
        email,
        password,
      });

      console.log(response.data); // Log to check the structure of response.data

      const { token, user } = response.data;

      if (token && user) {
        // Store user details in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('username', user.username || '');
        localStorage.setItem('user_id', user.u_id || '');
        localStorage.setItem('email', user.email || '');
        
        login();

        // Check the role and profile completion
        if (user.role === 'Player') {
          if (!user.playerProfileCompleted) {
            navigate('/player-profile'); // Redirect to player profile if not completed
          } else {
            navigate('/player-dashboard'); // Redirect to player dashboard if profile is completed
          }
        } else if (user.role === 'Organizer') {
          navigate('/organizer-dashboard'); // Redirect to organizer dashboard for organizers
        } else {
          navigate('/player-dashboard'); // Redirect to player dashboard for other roles
        }
      } else {
        setError('Unexpected response structure from the server.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('Login API endpoint not found. Please check the URL or server configuration.');
        } else {
          setError(err.response?.data?.message || 'An unexpected error occurred.');
        }
      } else {
        setError('An error occurred during login. Please try again.');
      }
      console.error('Error:', err);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2 className="login-header">Welcome Back to Cricket Tournament Management</h2>
        <p className="login-subtitle">Access your account to manage teams, track player stats, and more!</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
        </form>

        <p className="login-footer">Don’t have an account? <a href="/signup">Sign up here</a></p>
      </div>
    </div>
  );
};

export default Login;
