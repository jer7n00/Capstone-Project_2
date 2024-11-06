import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import OrganizerHome from './OrganizerHome';
import CreateTournament from './CreateTournament';
import ViewTournaments from './ViewTournaments';
import CreateTeam from './CreateTeam'; // Import CreateTeam
import TournamentDashboard from '../tournament/TournamentDashboard'; // Import TournamentDashboard
import '../../styles/OrganizerDashboard.css';

const OrganizerDashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1>Organizer Dashboard</h1>
        <ul>
          <li><Link to="/organizer-dashboard">Home</Link></li>
          <li><Link to="create-tournament">Create Tournament</Link></li>
          <li><Link to="view-tournaments">View Tournaments</Link></li>
          <li><Link to="create-team">Create Team</Link></li> {/* New Link */}
        </ul>
        <ul className="logout-link">
          <li><Link to="/" onClick={logout}>Logout</Link></li>
        </ul>
      </nav>

      <main className="dashboard-content">
        <Routes>
          <Route path="" element={<OrganizerHome />} />
          <Route path="create-tournament" element={<CreateTournament />} />
          <Route path="view-tournaments" element={<ViewTournaments />} />
          <Route path="create-team" element={<CreateTeam />} /> {/* New Route */}
          <Route path="view-tournaments/tournament/:tournamentId/*" element={<TournamentDashboard />} /> {/* Adjusted route for tournament dashboard */}
          
        </Routes>
      </main>
    </div>
  );
};

export default OrganizerDashboard;
