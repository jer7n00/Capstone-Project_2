import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../../styles/tournament/CreateMatch.css'; // Import the styling file

export interface Player {
  playerId: string;
  playerName: string;
}

export interface Team {
  teamId: string; // Change to match your team object structure
  teamName: string; // Assume there's a name field for display
}

export interface Match {
  matchId: string;
  matchNumber: string;
  matchType: string;
  matchDate: string; // Keep as string for your schema
  matchTime: string;
  location: string;
  tournamentId: string;
  firstTeamId: string;
  secondTeamId: string;
  firstTeamPlayers: Player[];
  secondTeamPlayers: Player[];
  status: string;
  winner: string;
}

const CreateMatch: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>(); // Get tournament ID from URL
  const [teams, setTeams] = useState<Team[]>([]); // Updated to use Team interface
  const [matchData, setMatchData] = useState<Match>({
    matchId: uuidv4(),
    matchNumber: '',
    matchType: '',
    matchDate: '', // Initialize as a formatted string
    matchTime: '',
    location: '',
    tournamentId: tournamentId || '',
    firstTeamId: '',
    secondTeamId: '',
    firstTeamPlayers: [],
    secondTeamPlayers: [],
    status: 'upcoming', // Consider changing default status
    winner: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
  const token = localStorage.getItem('token');

  // Fetch teams when component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      if (!tournamentId) {
        console.error('Tournament ID is required.');
        return; // Exit if tournamentId is not present
      }

      try {
        const response = await axios.get(`http://localhost:7000/api/tournaments/api/tournaments/tournaments/${tournamentId}/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [tournamentId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMatchData((prevState) => ({ ...prevState, [name]: value }));
    setErrorMessage(null); // Reset error message on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the two teams selected are the same
    if (matchData.firstTeamId === matchData.secondTeamId) {
      setErrorMessage('Two teams cannot be the same.');
      return; // Exit if teams are the same
    }

    try {
      console.log(matchData);
      await axios.post(`http://localhost:7000/api/matches/api/matches`, matchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Match created successfully!');
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Failed to create match. Please try again.');
    }
  };

  return (
    <div className="create-match-container">
      <h2>Create Match</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
      <form onSubmit={handleSubmit} className="match-form">
        <input
          type="text"
          name="matchNumber"
          value={matchData.matchNumber}
          onChange={handleChange}
          placeholder="Match Number"
          required
        />
        <select name="matchType" value={matchData.matchType} onChange={handleChange} required>
          <option value="">Select Match Type</option>
          <option value="group">Group</option>
          <option value="semi-final">Semi-Final</option>
          <option value="final">Final</option>
          <option value="knockout">Knockout</option>
        </select>
        
        <div className="team-input-container">
          <select
            name="firstTeamId"
            value={matchData.firstTeamId}
            onChange={handleChange}
            required
          >
            <option value="">Select First Team</option>
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.teamName}
              </option>
            ))}
          </select>
          <span className="vs-label">vs</span>
          <select
            name="secondTeamId"
            value={matchData.secondTeamId}
            onChange={handleChange}
            required
          >
            <option value="">Select Second Team</option>
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>
        
        <input
          type="date"
          name="matchDate"
          value={matchData.matchDate} // Already in YYYY-MM-DD format
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="matchTime"
          value={matchData.matchTime}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          value={matchData.location}
          onChange={handleChange}
          placeholder="Match Location"
          required
        />
        <button type="submit" className="create-match-button">Create Match</button>
      </form>
    </div>
  );
};

export default CreateMatch;
