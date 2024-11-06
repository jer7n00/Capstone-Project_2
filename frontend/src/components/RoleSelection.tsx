// src/components/RoleSelection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelection.css';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    // Redirect to the Sign Up page with the selected role as a URL parameter
    navigate(`/signup?role=${encodeURIComponent(role)}`);
  };

  return (
    <div className="role-selection">
      <h1>Select Your Role</h1>
      <div className="role-cards">
        <div className="role-card" onClick={() => handleRoleSelect('Player')}>
          <h2>Player</h2>
          <p>Track your performance and improve your game.</p>
        </div>
        <div className="role-card" onClick={() => handleRoleSelect('Team Manager')}>
          <h2>Team Manager</h2>
          <p>Manage your team and strategize for success.</p>
        </div>
        <div className="role-card" onClick={() => handleRoleSelect('Organizer')}>
          <h2>Organizer</h2>
          <p>Organize tournaments and manage events seamlessly.</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
