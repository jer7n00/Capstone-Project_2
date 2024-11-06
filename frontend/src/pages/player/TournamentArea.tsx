// src/components/TournamentArea.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/TournamentArea.css';

interface Tournament {
  tournamentId: string;
  tournamentName: string;
  startDate: Date;
  endDate: Date;
  noOfOvers: number;
  registrationDeadline: Date;
  rulesAndRegulations: string;
  organizerName: string;
  venue: string;
  winnerTeam?: string | null;
  teams: string[];
}

const TournamentArea: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:7000/api/tournaments/api/tournaments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTournaments(response.data);
      } catch (err) {
        setError('Failed to fetch tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleViewTeams = (tournamentId: string) => {
    navigate(`/player-dashboard/tournaments/${tournamentId}`);
  };

  if (loading) return <div>Loading tournaments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="tournament-area-container">
      <h2 className="tournament-heading">Upcoming Tournaments</h2>
      <div className="tournament-cards-container">
        {tournaments.map((tournament) => (
          <div key={tournament.tournamentId} className="tournament-card">
            <h3 className="tournament-name">{tournament.tournamentName}</h3>
            <p className="tournament-dates">Start Date: {new Date(tournament.startDate).toLocaleDateString()}</p>
            <p className="tournament-dates">End Date: {new Date(tournament.endDate).toLocaleDateString()}</p>
            <p className="tournament-location">Venue: {tournament.venue}</p>
            <p className="tournament-organizer">Organizer: {tournament.organizerName}</p>
            <p className="tournament-teams">Teams: {tournament.teams.join(', ')}</p>
            <button
              className="tournament-details-button"
              onClick={() => handleViewTeams(tournament.tournamentId)}
            >
              View Teams
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentArea;
