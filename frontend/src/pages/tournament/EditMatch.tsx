import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/tournament/EditMatch.css';

const EditMatch: React.FC = () => {
  const { matchId, tournamentId } = useParams<{ matchId: string; tournamentId: string }>();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstTeamScore: '',
    secondTeamScore: '',
    firstTeamWickets: '',
    secondTeamWickets: '',
    status: '',
    winner: '',
  });

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/matches/api/matches/${matchId}`);
        setMatchDetails(response.data);
        // Set form data with existing match details
        setFormData({
          firstTeamScore: response.data.firstTeamScore || '',
          secondTeamScore: response.data.secondTeamScore || '',
          firstTeamWickets: response.data.firstTeamWickets || '',
          secondTeamWickets: response.data.secondTeamWickets || '',
          status: response.data.status || '',
          winner: response.data.winner || '',
        });
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/matches/match/${matchId}/series/${tournamentId}`,
        {
          ...formData,
        }
      );
      // After successful update, navigate back to the matches page
      navigate(`/tournament-dashboard/${tournamentId}`);
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  return (
    <div className="edit-match-container">
      <h2>Edit Match</h2>
      {matchDetails ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Team Score:</label>
            <input
              type="number"
              name="firstTeamScore"
              value={formData.firstTeamScore}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Second Team Score:</label>
            <input
              type="number"
              name="secondTeamScore"
              value={formData.secondTeamScore}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>First Team Wickets:</label>
            <input
              type="number"
              name="firstTeamWickets"
              value={formData.firstTeamWickets}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Second Team Wickets:</label>
            <input
              type="number"
              name="secondTeamWickets"
              value={formData.secondTeamWickets}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Winner:</label>
            <input
              type="text"
              name="winner"
              value={formData.winner}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Confirm Submit</button>
        </form>
      ) : (
        <p>Loading match details...</p>
      )}
      {/* Back button */}
      <button onClick={() => navigate(`/tournament-dashboard/${tournamentId}`)} className="back-button">
        Back to Matches
      </button>
    </div>
  );
};

export default EditMatch;
