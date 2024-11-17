import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/tournament/MatchScorecard.css';

interface PlayerStats {
  playerId: string;
  playerName: string;
  runs?: number;
  wickets?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  catches?: number;
  strikeRate?: number;
}

interface MatchData {
  matchId: string;
  seriesId: string;
  firstTeamPlayers: PlayerStats[];
  secondTeamPlayers: PlayerStats[];
}

const MatchScoreboard: React.FC = () => {
  const { matchId, seriesId } = useParams<{ matchId: string; seriesId: string }>();
  const [matchData, setMatchData] = useState<MatchData | null>(null);

  useEffect(() => {
    // Fetch match details on component load
    const fetchMatchData = async () => {
      try {
        const response = await axios.get(`/api/matches/${seriesId}/${matchId}`);
        setMatchData(response.data);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };
    fetchMatchData();
  }, [matchId, seriesId]);

  const handleStatsChange = (team: string, playerId: string, field: keyof PlayerStats, value: number) => {
    setMatchData((prevData) => {
      if (!prevData) return prevData;

      const updateTeam = team === 'first' ? 'firstTeamPlayers' : 'secondTeamPlayers';
      return {
        ...prevData,
        [updateTeam]: prevData[updateTeam].map((player) =>
          player.playerId === playerId ? { ...player, [field]: value } : player
        ),
      };
    });
  };

  const saveStats = async () => {
    try {
      const updates = [...(matchData?.firstTeamPlayers || []), ...(matchData?.secondTeamPlayers || [])];
      const promises = updates.map((player) =>
        axios.put(`/api/players/${player.playerId}/stats`, {
          runs: player.runs,
          wickets: player.wickets,
          balls: player.balls,
          fours: player.fours,
          sixes: player.sixes,
          catches: player.catches,
          strikeRate: player.strikeRate,
        })
      );
      await Promise.all(promises);
      alert("Statistics updated successfully");
    } catch (error) {
      console.error("Error saving stats:", error);
      alert("Failed to update statistics");
    }
  };

  return (
    <div className="match-scoreboard">
      <h1>Match Scoreboard</h1>
      {matchData ? (
        <>
          <div className="team-scoreboard">
            <h2>First Team</h2>
            {matchData.firstTeamPlayers.map((player) => (
              <div key={player.playerId} className="player-stats-row">
                <h3>{player.playerName}</h3>
                <input
                  type="number"
                  placeholder="Runs"
                  value={player.runs || ''}
                  onChange={(e) => handleStatsChange('first', player.playerId, 'runs', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Wickets"
                  value={player.wickets || ''}
                  onChange={(e) => handleStatsChange('first', player.playerId, 'wickets', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Balls"
                  value={player.balls || ''}
                  onChange={(e) => handleStatsChange('first', player.playerId, 'balls', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Fours"
                  value={player.fours || ''}
                  onChange={(e) => handleStatsChange('first', player.playerId, 'fours', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Sixes"
                  value={player.sixes || ''}
                  onChange={(e) => handleStatsChange('first', player.playerId, 'sixes', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Catches"
                  value={player.catches || ''}
                  onChange={(e) => handleStatsChange('first', player.playerId, 'catches', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Strike Rate"
                  value={player.strikeRate || ''}
                  readOnly
                />
              </div>
            ))}
          </div>
          <div className="team-scoreboard">
            <h2>Second Team</h2>
            {matchData.secondTeamPlayers.map((player) => (
              <div key={player.playerId} className="player-stats-row">
                <h3>{player.playerName}</h3>
                {/* Similar inputs for second team players */}
                <input
                  type="number"
                  placeholder="Runs"
                  value={player.runs || ''}
                  onChange={(e) => handleStatsChange('second', player.playerId, 'runs', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Wickets"
                  value={player.wickets || ''}
                  onChange={(e) => handleStatsChange('second', player.playerId, 'wickets', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Balls"
                  value={player.balls || ''}
                  onChange={(e) => handleStatsChange('second', player.playerId, 'balls', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Fours"
                  value={player.fours || ''}
                  onChange={(e) => handleStatsChange('second', player.playerId, 'fours', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Sixes"
                  value={player.sixes || ''}
                  onChange={(e) => handleStatsChange('second', player.playerId, 'sixes', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Catches"
                  value={player.catches || ''}
                  onChange={(e) => handleStatsChange('second', player.playerId, 'catches', +e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Strike Rate"
                  value={player.strikeRate || ''}
                  readOnly
                />
              </div>
            ))}
          </div>
          <button onClick={saveStats} className="save-button">Save Stats</button>
        </>
      ) : (
        <p>Loading match data...</p>
      )}
    </div>
  );
};

export default MatchScoreboard;
