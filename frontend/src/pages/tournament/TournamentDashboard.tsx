import React from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import ViewMatches from './ViewMatches';
import CreateMatch from './CreateMatch';
import AcceptRegistrations from './AcceptRegistrations';
import '../../styles/OrganizerDashboard.css';

const TournamentDashboard: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>(); // Get tournament ID from URL
  const { logout } = useAuth();

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1>Tournament Dashboard</h1>
        <ul>
          <li><Link to={`/tournament-dashboard/${tournamentId}`}>View Matches</Link></li>
          <li><Link to={`/tournament-dashboard/${tournamentId}/create-match`}>Create Match</Link></li>
          <li><Link to={`/tournament-dashboard/${tournamentId}/accept-registrations`}>Accept Registrations</Link></li>
        </ul>
        <ul className="logout-link">
          <li><Link to="/" onClick={logout}>Logout</Link></li>
        </ul>
      </nav>

      <main className="dashboard-content">
        <Link to="/organizer-dashboard" className="back-button" aria-label="Back to Organizer Dashboard"></Link> {/* Back button */}
        <Routes>
          <Route path="" element={<ViewMatches />} />
          <Route path="create-match" element={<CreateMatch />} />
          <Route path="accept-registrations" element={<AcceptRegistrations />} />
        </Routes>
      </main>
    </div>
  );
};

export default TournamentDashboard;
