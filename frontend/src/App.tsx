import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import RoleSelection from './components/RoleSelection';
import PlayerDashboard from './pages/player/PlayerDashboard';
import { AuthProvider } from './components/AuthContext';
import PlayerProfile from './pages/player/PlayerProfile';
import PlayerDetails from './pages/player/PlayerDetails';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import TournamentDashboard from './pages/tournament/TournamentDashboard';
import EditMatch from './pages/tournament/EditMatch';
import About from './pages/About'; // Import About page
import Features from './pages/Features';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/player-dashboard/*" element={<PlayerDashboard />} />
        <Route path="/organizer-dashboard/*" element={<OrganizerDashboard />} />
        <Route path="/player-profile" element={<PlayerProfile/>}/>
        <Route path="/tournament-dashboard/:tournamentId/*" element={<TournamentDashboard />} /> {/* Separate route */}
        {/* <Route path = "/palyer-details" element = {<PlayerDetails/>}/> */}
        <Route path="/edit-match/:matchId/:tournamentId" element={<EditMatch />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
