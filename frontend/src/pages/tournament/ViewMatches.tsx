import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/tournament/ViewMatches.css';

interface Player {
  playerId: string;
  playerName: string;
}

interface Team {
  teamId: string;
  teamName: string;
}

interface Match {
  matchId: string;
  matchNumber: string;
  matchType: string;
  matchDate: string;
  matchTime: string;
  location: string;
  tournamentId: string;
  firstTeamId: string;
  secondTeamId: string;
  firstTeamScore: number;
  secondTeamScore: number;
  firstTeamWickets: number;
  secondTeamWickets: number;
  status: string;
  winner: string;
}

const ViewMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const token = localStorage.getItem('token');
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/matches/api/matches/api/matches/${tournamentId}/bytournamentId`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [token, tournamentId]);

  const handleEditMatch = (matchId: string) => {
    navigate(`/edit-match/${matchId}/${tournamentId}`);
  };

  return (
    <div className="matches-container">
      <h2>Upcoming Matches</h2>
      <div className="matches-list">
        {matches.map((match) => (
          <div key={match.matchId} className="match-card">
            <h3 className="match-title">{match.matchNumber} - {match.matchType}</h3>
            <div className="match-details">
              <p><strong>Date:</strong> {new Date(`${match.matchDate}T${match.matchTime}`).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {match.matchTime}</p>
              <p><strong>Location:</strong> {match.location}</p>
              <p><strong>Teams:</strong> <span className="team-name">{match.firstTeamId}</span> vs <span className="team-name">{match.secondTeamId}</span></p>
              <p><strong>Status:</strong> <span className={`status ${match.status.toLowerCase()}`}>{match.status}</span></p>
              
              {/* Show scores if the match status is "completed" */}
              {match.status === 'completed' && (
                <div className="completed-score">
                  <div className="score-card">
                    <span className="score-label">{match.firstTeamId}</span> {match.firstTeamScore}/{match.firstTeamWickets}
                  </div>
                  <div className="score-card">
                    <span className="score-label">{match.secondTeamId}</span> {match.secondTeamScore}/{match.secondTeamWickets}
                  </div>
                  <p className="winner">Winner: {match.winner || 'TBD'}</p>
                </div>
              )}
            </div>
            <div className="match-footer">
              <button className="view-details-button" onClick={() => handleEditMatch(match.matchId)}>Edit Match</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMatches;
