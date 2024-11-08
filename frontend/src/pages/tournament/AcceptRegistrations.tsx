import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/tournament/AcceptRegistrations.css';

interface Team {
  teamId: string;
  teamName: string;
  seriesId: string;
}

interface Player {
  player_id: string;
  user_id: string;
  name: string;
  age: number;
  role: string;
  profilePic?: string;
  battingStats?: {
    runs: number;
    matchesPlayed: number;
    fours: number;
    sixes: number;
    strikeRate: number;
  };
  bowlingStats?: {
    wickets: number;
    matchesPlayed: number;
    catches: number;
  };
  teamId?: string;
}

interface RegisteredPlayer {
  playerId: string;
  teamId: string;
  playerDetails?: Player;
  teamDetails?: Team;
}

const AcceptRegistrations: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRegisteredPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/teams/api/teams/db/registered-players`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const playersWithDetails = await Promise.all(
          response.data.map(async (registered: RegisteredPlayer) => {
            const playerResponse = await axios.get(`http://localhost:7000/api/players/player_id/${registered.playerId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            const teamResponse = await axios.get(`http://localhost:7000/api/teams/api/teams/${registered.teamId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            return {
              ...registered,
              playerDetails: playerResponse.data,
              teamDetails: teamResponse.data,
            };
          })
        );

        const filteredPlayers = playersWithDetails.filter(
          (registered) => registered.teamDetails?.seriesId === tournamentId
        );

        setRegisteredPlayers(filteredPlayers);
      } catch (error) {
        console.error('Error fetching registered players:', error);
      }
    };

    fetchRegisteredPlayers();
  }, [token, tournamentId]);

  const acceptRegistration = async (playerId: string, teamId: string) => {
    try {
      await axios.post(
        `http://localhost:7000/api/teams/api/acceptPlayer/${playerId}/${teamId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Player accepted successfully!');
      setRegisteredPlayers((prevPlayers) => prevPlayers.filter((player) => player.playerId !== playerId));
    } catch (error) {
      console.error('Error accepting player registration:', error);
    }
  };

  const rejectRegistration = async (playerId: string) => {
    try {
      await axios.delete(`http://localhost:7000/api/teams/api/rejectPlayer/deleteRegistered/${playerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Player rejected successfully!');
      setRegisteredPlayers((prevPlayers) => prevPlayers.filter((player) => player.playerId !== playerId));
    } catch (error) {
      console.error('Error rejecting player registration:', error);
    }
  };

  const handleViewDetails = (player: Player) => {
    setSelectedPlayer(player);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  return (
    <div className="accept-registration-table">
      <h2>Registrations</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Age</th>
            <th>Role</th>
            <th>Team</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registeredPlayers.map((registeredPlayer) => (
            <tr key={registeredPlayer.playerId}>
              <td>{registeredPlayer.playerDetails?.name}</td>
              <td>{registeredPlayer.playerDetails?.age}</td>
              <td>{registeredPlayer.playerDetails?.role}</td>
              <td>{registeredPlayer.teamDetails?.teamName || 'Unknown Team'}</td>
              <td>
                <button onClick={() => acceptRegistration(registeredPlayer.playerId, registeredPlayer.teamId)}>Accept</button>
                <button onClick={() => rejectRegistration(registeredPlayer.playerId)}>Reject</button>
                <button onClick={() => handleViewDetails(registeredPlayer.playerDetails!)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPlayer && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>{selectedPlayer.name}'s Details</h3>
            <p><strong>Age:</strong> {selectedPlayer.age}</p>
            <p><strong>Role:</strong> {selectedPlayer.role}</p>
            {selectedPlayer.battingStats && (
              <>
                <h4>Batting Stats</h4>
                <p><strong>Runs:</strong> {selectedPlayer.battingStats.runs}</p>
                <p><strong>Matches Played:</strong> {selectedPlayer.battingStats.matchesPlayed}</p>
                <p><strong>Strike Rate:</strong> {selectedPlayer.battingStats.strikeRate}</p>
              </>
            )}
            {selectedPlayer.bowlingStats && (
              <>
                <h4>Bowling Stats</h4>
                <p><strong>Wickets:</strong> {selectedPlayer.bowlingStats.wickets}</p>
                <p><strong>Matches Played:</strong> {selectedPlayer.bowlingStats.matchesPlayed}</p>
                <p><strong>Catches:</strong> {selectedPlayer.bowlingStats.catches}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptRegistrations;
