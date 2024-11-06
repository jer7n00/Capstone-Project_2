import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../../styles/organizer/ViewTournaments.css';

interface Tournament {
  tournamentId: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  venue: string;
  noOfOvers: number;
}

const ViewTournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchTournaments = async () => {
      if (!userId) {
        console.error('User ID not found in local storage');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:7000/api/tournaments/api/tournaments/tournamentuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };
    fetchTournaments();
  }, [token, userId]);

  const handleTournamentClick = (tournamentId: string) => {
    console.log(tournamentId);
    // navigate(`/organizer-dashboard/view-tournaments/tournament/${tournamentId}`); // Adjusted path to match the route
    //navigate(`/organizer-dashboard/view-tournaments/tournament/${tournamentId}`);
    navigate(`/tournament-dashboard/${tournamentId}`);
  };

  return (
    <div className="view-tournaments-container">
      <h2>Your Tournaments</h2>
      <div className="tournament-cards">
        {tournaments.map((tournament) => (
          <div className="tournament-card" key={tournament.tournamentId} onClick={() => handleTournamentClick(tournament.tournamentId)}>
            <h3>{tournament.tournamentName}</h3>
            <p><strong>Venue:</strong> {tournament.venue}</p>
            <p><strong>Overs:</strong> {tournament.noOfOvers}</p>
            <p><strong>Dates:</strong> {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTournaments;
