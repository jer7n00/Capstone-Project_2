import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/tournament/EditMatch.css';

interface MatchDetails {
  firstTeamId: string;
  secondTeamId: string;
  firstTeamScore: number;
  secondTeamScore: number;
  firstTeamWickets: number;
  secondTeamWickets: number;
  status: string;
  winner: string;
}

const EditMatch: React.FC = () => {
  const { matchId, tournamentId } = useParams<{ matchId: string; tournamentId: string }>();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [formData, setFormData] = useState({
    firstTeamScore: '',
    secondTeamScore: '',
    firstTeamWickets: '',
    secondTeamWickets: '',
    status: '',
    winner: '',
  });

  const statusOptions = ["upcoming", "ongoing", "completed"];

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/matches/api/matches/${matchId}`);
        setMatchDetails(response.data);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        { ...formData }
      );
      navigate(`/tournament-dashboard/${tournamentId}`);
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  return (
    <div className="edit-match-container">
      <button onClick={() => navigate(`/tournament-dashboard/${tournamentId}`)} className="back-button" />
      <h2>Edit Match</h2>
      {matchDetails ? (
        <div className="match-details-form">
          <div className="team-score-section">
            <div>
              <label>{matchDetails.firstTeamId} Score:</label>
              <input
                type="number"
                name="firstTeamScore"
                value={formData.firstTeamScore}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>{matchDetails.firstTeamId} Wickets:</label>
              <input
                type="number"
                name="firstTeamWickets"
                value={formData.firstTeamWickets}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="team-score-section">
            <div>
              <label>{matchDetails.secondTeamId} Score:</label>
              <input
                type="number"
                name="secondTeamScore"
                value={formData.secondTeamScore}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>{matchDetails.secondTeamId} Wickets:</label>
              <input
                type="number"
                name="secondTeamWickets"
                value={formData.secondTeamWickets}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="match-status-section">
            <label>Status:</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="winner-section">
            <label>Winner:</label>
            <select name="winner" value={formData.winner} onChange={handleChange}>
              <option value="">Select Winner</option>
              <option value={matchDetails.firstTeamId}>{matchDetails.firstTeamId}</option>
              <option value={matchDetails.secondTeamId}>{matchDetails.secondTeamId}</option>
              <option value="Tie">Tie</option> {/* Added Tie option */}
            </select>
          </div>
          <button type="button" onClick={handleSubmit} className="confirm-submit">
            Confirm Submit
          </button>
        </div>
      ) : (
        <p>Loading match details...</p>
      )}
    </div>
  );
};

export default EditMatch;
