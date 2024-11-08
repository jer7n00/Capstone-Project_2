// ViewTeams.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/tournament/ViewTeams.css';

interface Team {
  teamId: string;
  teamName: string;
  seriesId: string;
  noOfMatches: number;
  wins: number;
  losses: number;
  players: string[];
  teamLogoUrl?: string;
  userId: string;
}

const ViewTeams: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/teams/api/teams/${tournamentId}/bytournament`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        // Sort teams by number of wins in descending order
        const sortedTeams = response.data.sort((a: Team, b: Team) => b.wins - a.wins);
        setTeams(sortedTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, [tournamentId, token]);

  return (
    <div className="view-teams">
      <h2>Teams</h2>
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Team Name</th>
            <th>Matches Played</th>
            <th>Wins</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.teamId}>
              <td>
                {team.teamLogoUrl ? (
                  <img src={team.teamLogoUrl} alt={`${team.teamName} Logo`} width="50" height="50" />
                ) : (
                  'No Logo'
                )}
              </td>
              <td>{team.teamName}</td>
              <td>{team.noOfMatches}</td>
              <td>{team.wins}</td>
              <td>{team.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTeams;
