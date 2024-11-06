// src/components/TeamArea.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../components/TeamRegistrationModal';
import '../../styles/TeamArea.css';

interface Team {
  teamId: string;
  teamName: string;
}

interface Tournament {
  tournamentId: string;
  tournamentName: string;
}

const TeamArea: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [tournamentDetails, setTournamentDetails] = useState<Tournament | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null); // To store player ID

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:7000/api/tournaments/api/tournaments/tournaments/${tournamentId}/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data);
      } catch (err) {
        setError('Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    const fetchTournamentDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:7000/api/tournaments/api/tournaments/tournaments/${tournamentId}/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTournamentDetails(response.data);
      } catch (err) {
        setError('Failed to fetch tournament details');
      }
    };

    const fetchPlayerId = async () => {
      const user_id = localStorage.getItem('user_id'); // Fetch the user_id from local storage
      if (user_id) {
        try {
          console.log(user_id);
          const token = localStorage.getItem('token');
          const response = await axios.get<{ player_id: string }>(`http://localhost:7000/api/players/user_id/${user_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data.player_id);
          setPlayerId(response.data.player_id); // Assuming the response contains playerId
        } catch (err) {
          setError('Failed to fetch player ID');
        }
      }
    };

    fetchTeams();
    fetchTournamentDetails();
    fetchPlayerId(); // Fetch player ID after fetching teams and tournament details
  }, [tournamentId]);

  const handleJoinTeam = (team: Team) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    //console.log('hello');
    //console.log(selectedTeam);
    if (!selectedTeam || !playerId) {console.log('failed'); return;}

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:7000/api/teams/api/teams/register-player', {
        playerId: playerId, // Include player ID
        teamId: selectedTeam.teamId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Successfully registered for the team!'); // Feedback to the user
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to register for the team.');
    }
  };

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="team-area-container">
      <h2 className="team-heading">Teams in Tournament</h2>
      <div className="team-cards-container">
        {teams.map((team) => (
          <div key={team.teamId} className="team-card">
            <img src="https://via.placeholder.com/80" alt="Team Logo" className="team-logo" />
            <div className="team-info">
              <h3 className="team-name">{team.teamName}</h3>
              <p className="team-id">ID: {team.teamId}</p>
              <button className="join-team-button" onClick={() => handleJoinTeam(team)}>Join Team</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for registration confirmation */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleConfirmRegistration} 
        teamDetails={selectedTeam} 
        tournamentDetails={tournamentDetails} 
      />
    </div>
  );
};

export default TeamArea;
