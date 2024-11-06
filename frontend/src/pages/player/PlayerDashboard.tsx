import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import PlayerHome from './PlayerHome';

import TeamArea from './TeamArea';
import TournamentArea from './TournamentArea';
import PlayerStatistics from './PlayerStatistics';
import PlayerFitness from './PlayerFitness';
import { useAuth } from '../../components/AuthContext'; // Assuming the AuthContext is in src/components
import '../../styles/PlayerDashboard.css';
import '../../styles/OrganizerDashboard.css';
import Home from '../Home';
import PlayerDetails from './PlayerDetails';

const PlayerDashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1>Player Dashboard</h1>
        <ul>
          <li><Link to="/player-dashboard">Home</Link></li>
          <li><Link to="/player-dashboard/profile">Profile</Link></li>
          <li><Link to="/player-dashboard/tournaments">Tournaments</Link></li>
          <li><Link to="/player-dashboard/statistics">Statistics</Link></li>
          <li><Link to="/player-dashboard/fitness">Fitness</Link></li>
        </ul>
        <ul className="logout-link">
          <li><a href="/" onClick={logout}>Logout</a></li> {/* Correct usage of logout */}
        </ul>
      </nav>

      <main className="dashboard-content">
        <Routes>
          <Route path="" element={<PlayerHome />} />
          <Route path="profile" element={<PlayerDetails />} />
          <Route path="tournaments" element={<TournamentArea />} />
          <Route path="tournaments/:tournamentId" element={<TeamArea />} />
          <Route path="statistics" element={<PlayerStatistics />} />
          <Route path="fitness" element={<PlayerFitness />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default PlayerDashboard;
