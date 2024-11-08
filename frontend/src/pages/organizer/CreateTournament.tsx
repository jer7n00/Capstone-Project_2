import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/organizer/CreateTournament.css';

const CreateTournament: React.FC = () => {
  const [tournamentData, setTournamentData] = useState({
    tournamentId: '',
    tournamentName: '',
    startDate: '',
    endDate: '',
    noOfOvers: '',
    registrationDeadline: '',
    rulesAndRegulations: '',
    organizerName: '',
    venue: '',
  });

  const [teams, setTeams] = useState<{ id: string; name: string; seriesId: string; logoUrl: string }[]>([]); // Teams added to tournament with logo URL
  const [showModal, setShowModal] = useState(false);
  const [availableTeams, setAvailableTeams] = useState<{ teamId: string; name: string; logoUrl: string }[]>([]); // Available teams to select
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]); // IDs of selected teams

  const token = localStorage.getItem('token'); // Retrieve token from local storage
  const user_id = localStorage.getItem('user_id'); // Retrieve user_id from local storage

  // Fetch available teams when modal is opened
  const fetchAvailableTeams = async () => {
    try {
      const response = await axios.get(`http://localhost:7000/api/teams/api/teams/${user_id}/byUserId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableTeams(response.data.map((team: any) => ({
        teamId: team.teamId, // Ensure the API response provides the correct fields
        name: team.teamName,
        logoUrl: team.teamLogoUrl, // Fetch the team logo URL from the response
      })));
      console.log(response.data); // Assuming the response contains an array of teams
    } catch (error) {
      console.error('Error fetching available teams', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTournamentData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeams((prevSelectedTeams) =>
      prevSelectedTeams.includes(teamId)
        ? prevSelectedTeams.filter((id) => id !== teamId)
        : [...prevSelectedTeams, teamId]
    );
  };

  const addTeams = () => {
    const seriesId = tournamentData.tournamentId; // Get the current tournament ID
    // Add selected teams to the teams array
    setTeams((prevTeams) => [
      ...prevTeams,
      ...availableTeams.filter((team) => selectedTeams.includes(team.teamId)).map((team) => ({
        id: team.teamId, // Use teamId for consistency
        name: team.name,
        logoUrl: team.logoUrl, // Include the logo URL
        seriesId,
      })),
    ]);
    setShowModal(false); // Close the modal
    setSelectedTeams([]); // Reset selected teams
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create tournament
      const response = await axios.post(
        'http://localhost:7000/api/tournaments/api/tournaments',
        {
          ...tournamentData,
          user_id, // Add user_id to request body
          teams: teams.map((team) => team.id), // Only include team IDs in tournament data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Tournament created successfully!');

      // Reset tournament data and teams after successful creation
      setTournamentData({
        tournamentId: '',
        tournamentName: '',
        startDate: '',
        endDate: '',
        noOfOvers: '',
        registrationDeadline: '',
        rulesAndRegulations: '',
        organizerName: '',
        venue: '',
      });
      setTeams([]);
    } catch (error) {
      alert('Failed to create tournament. Please try again.');
    }
  };

  return (
    <div className="create-tournament-container">
      <h2>Create Tournament</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields remain unchanged */}
        <div className="form-group">
          <label htmlFor="tournamentId">Tournament ID</label>
          <input
            type="text"
            name="tournamentId"
            value={tournamentData.tournamentId}
            onChange={handleChange}
            placeholder="Unique tournament ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tournamentName">Tournament Name</label>
          <input
            type="text"
            name="tournamentName"
            value={tournamentData.tournamentName}
            onChange={handleChange}
            placeholder="Tournament name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={tournamentData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            name="endDate"
            value={tournamentData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="noOfOvers">Number of Overs</label>
          <input
            type="number"
            name="noOfOvers"
            value={tournamentData.noOfOvers}
            onChange={handleChange}
            placeholder="Number of overs per match"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="registrationDeadline">Registration Deadline</label>
          <input
            type="date"
            name="registrationDeadline"
            value={tournamentData.registrationDeadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rulesAndRegulations">Rules and Regulations</label>
          <textarea
            name="rulesAndRegulations"
            value={tournamentData.rulesAndRegulations}
            onChange={handleChange}
            placeholder="Enter the rules and regulations"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="organizerName">Organizer Name</label>
          <input
            type="text"
            name="organizerName"
            value={tournamentData.organizerName}
            onChange={handleChange}
            placeholder="Organizer name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue</label>
          <input
            type="text"
            name="venue"
            value={tournamentData.venue}
            onChange={handleChange}
            placeholder="Tournament venue"
            required
          />
        </div>

        <div className="form-group">
          <label>Teams</label>
          <ul className="team-list">
            {teams.map((team, index) => (
              <li key={index}>
                <img src={team.logoUrl} alt={team.name} style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                {team.name} (ID: {team.id}, Series ID: {team.seriesId})
              </li>
            ))}
          </ul>
          <button type="button" className="add-team-button" onClick={() => { fetchAvailableTeams(); setShowModal(true); }}>
            Add Team
          </button>
        </div>

        <button type="submit" className="submit-button">
          Create Tournament
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select Teams</h3>
            <div className="available-teams">
              {availableTeams.map((team) => (
                <div key={team.teamId} className="team-option">
                  <input
                    type="checkbox"
                    id={`team-${team.teamId}`}
                    checked={selectedTeams.includes(team.teamId)}
                    onChange={() => handleSelectTeam(team.teamId)}
                  />
                  <label htmlFor={`team-${team.teamId}`}>
                    <img src={team.logoUrl} alt={team.name} style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                    {team.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="add-team-submit-button" onClick={addTeams}>
                Add Selected Teams
              </button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTournament;
