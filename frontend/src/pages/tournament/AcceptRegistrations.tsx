import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Team {
  teamId: string;
  teamName: string;
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
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch registered players with their team IDs
    const fetchRegisteredPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/teams/api/teams/db/registered-players`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const playersWithDetails = await Promise.all(
          response.data.map(async (registered: RegisteredPlayer) => {
            // Fetch player details by playerId
            const playerResponse = await axios.get(`http://localhost:7000/api/players/player_id/${registered.playerId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            // Fetch team details by teamId
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
        setRegisteredPlayers(playersWithDetails);
      } catch (error) {
        console.error('Error fetching registered players:', error);
      }
    };

    fetchRegisteredPlayers();
  }, [token]);

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
      // Update state to remove accepted player
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
      // Update state to remove rejected player
      setRegisteredPlayers((prevPlayers) => prevPlayers.filter((player) => player.playerId !== playerId));
    } catch (error) {
      console.error('Error rejecting player registration:', error);
    }
  };

  return (
    <div>
      <h2>Accept Registrations</h2>
      <ul>
        {registeredPlayers.map((registeredPlayer) => (
          <li key={registeredPlayer.playerId}>
            <p>
              Player: {registeredPlayer.playerDetails?.name} | Age: {registeredPlayer.playerDetails?.age} | Role: {registeredPlayer.playerDetails?.role}
            </p>
            <p>
              Team: {registeredPlayer.teamDetails?.teamName || 'Unknown Team'}
            </p>
            <button onClick={() => acceptRegistration(registeredPlayer.playerId, registeredPlayer.teamId)}>Accept</button>
            <button onClick={() => rejectRegistration(registeredPlayer.playerId)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcceptRegistrations;
