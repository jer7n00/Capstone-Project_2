import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/SignUp.css';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve role from location state
  useEffect(() => {
    const selectedRole = new URLSearchParams(location.search).get('role');
    if (selectedRole) {
      setRole(selectedRole);
      console.log('Selected Role:', selectedRole);
    }
  }, [location]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
  
    if (!name) newErrors.name = 'Name is required.';
    
    if (!username) {
      newErrors.username = 'Username is required.';
    } else if (/^\d+$/.test(username)) {
      newErrors.username = 'Username cannot be all numbers.';
    } else if (!/^[a-zA-Z0-9]{3,15}$/.test(username)) {
      newErrors.username = 'Username must be 3-15 characters and contain only letters and numbers.';
    }
  
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Invalid email format.';
    }
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must be at least 8 characters, with one uppercase letter and one symbol.';
    }
  
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
  
    if (!role) newErrors.role = 'Please select a role.';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Send form data to the backend
        await axios.post('http://localhost:7000/api/auth/register', {
          name,
          username,
          email,
          password,
          role,
        });

        // On successful registration, redirect to login
        setSuccessMessage('User registered successfully!');
        navigate('/login');
      } catch (error: any) {
        if (error.response && error.response.data) {
          const apiError = error.response.data.message;

          // Check for duplicate email error
          if (apiError === 'User already exists with this email.') {
            setErrors({ api: 'User already exists with this email.' });
          } else {
            setErrors({ api: apiError });
          }
        } else {
          setErrors({ api: 'An unexpected error occurred. Please try again.' });
        }
      }
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <h2 className="signup-header">Join the Ultimate Cricket Tournament Platform</h2>
        <p className="signup-subtitle">Manage teams, track player stats, organize tournaments, and more!</p>

        <form onSubmit={handleSubmit}>
          {successMessage && <p className="success-text">{successMessage}</p>}
          {errors.api && <p className="error-text">{errors.api}</p>}

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="error-text">{errors.username}</p>}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordMatch(e.target.value === password);
            }}
            required
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select your role</option>
            <option value="Player">Player</option>
            <option value="Team Manager">Team Manager</option>
            <option value="Organizer">Organizer</option>
          </select>
          {errors.role && <p className="error-text">{errors.role}</p>}

          <button type="submit">Sign Up</button>
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
        </form>

        <p className="signup-footer">Already have an account? <a href="/select-role">Log in</a></p>
      </div>
    </div>
  );
};

export default SignUp;
