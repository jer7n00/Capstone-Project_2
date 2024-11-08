// src/components/TeamArea.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../components/TeamRegistrationModal';
import '../../styles/TeamArea.css';

interface Team {
  teamId: string;
  teamName: string;
  teamLogoUrl: string;
  players: string[]; // Array to hold player IDs
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
  const [isJoining, setIsJoining] = useState<boolean>(false); // Loading state for "Join Team"

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
      const user_id = localStorage.getItem('user_id');
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
          setPlayerId(response.data.player_id);
        } catch (err) {
          setError('Failed to fetch player ID');
        }
      }
    };

    fetchTeams();
    fetchTournamentDetails();
    fetchPlayerId();
  }, [tournamentId]);

  const handleJoinTeam = (team: Team) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    if (!selectedTeam || !playerId) return;
    setIsJoining(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:7000/api/teams/api/teams/register-player', {
        playerId: playerId,
        teamId: selectedTeam.teamId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Successfully registered for the team!');
      setModalOpen(false);
      // Update the team players count after registration
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.teamId === selectedTeam.teamId
            ? { ...team, players: [...team.players, playerId] }
            : team
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to register for the team.');
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="team-area-container">
      <h2 className="team-heading">Teams in Tournament</h2>
      <div className="team-cards-container">
        {teams.map((team) => {
          const playerCount = team.players.length;
          const isFull = playerCount >= 15;

          return (
            <div key={team.teamId} className="team-card">
              <img src={team.teamLogoUrl || "https://via.placeholder.com/80"} alt="Team Logo" className="team-logo" />
              <div className="team-info">
                <h3 className="team-name">{team.teamName}</h3>
                <p className="team-id">ID: {team.teamId}</p>
                <p className="team-players">Players: {playerCount}/15</p>
                <button 
                  className="join-team-button" 
                  onClick={() => handleJoinTeam(team)} 
                  disabled={isJoining || isFull}
                >
                  {isJoining && selectedTeam?.teamId === team.teamId ? "Joining..." : isFull ? "Team Full" : "Join Team"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for registration confirmation */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleConfirmRegistration} 
        teamDetails={selectedTeam} 
      />
    </div>
  );
};

export default TeamArea;
