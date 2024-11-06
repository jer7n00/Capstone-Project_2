import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Cricket Tournament</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/features">Features</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/select-role" className="signup-button">Sign Up</Link>
          </>
        ) : (
          null
         // console.log("Logged In");
       // <button onClick={logout} className="logout-button">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
