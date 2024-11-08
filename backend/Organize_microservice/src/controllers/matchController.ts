import { Request, Response } from 'express';
import Match from '../models/match';
import axios from 'axios';

//another navigation bar for the match creation , update 
// Create a new match
// export const createMatch = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const match = new Match(req.body);
//     await match.save();
//     res.status(201).json(match);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating match', error });
//   }
// };

// creating match ->update match ( searching the scorecard)
// Update match scores
// export const updateMatchScores = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { matchId, firstTeamScore, secondTeamScore, firstTeamWickets, secondTeamWickets, winner } = req.body;

//     const updatedMatch = await Match.findOneAndUpdate(
//       { matchId },
//       { firstTeamScore, secondTeamScore, firstTeamWickets, secondTeamWickets, winner },
//       { new: true }
//     );

//     if (!updatedMatch) {
//        res.status(404).json({ message: 'Match not found' });
//     }

//     res.status(200).json(updatedMatch);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating match scores', error });
//   }
 
// Function to update player stats in the Player Microservice

// const updatePlayerStats = async (playerId: string, runs: number, wickets: number) => {
//   try {
//     console.log(playerId);
//     console.log(runs);
//     console.log(wickets);
//     //change the localhost address for player 
//     const response = await axios.put(`http://localhost:5001/api/players/${playerId}/stats`, { runs, wickets });
                                  
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating stats for player ${playerId}`, error);
//   }
// };

// export const updateMatchScores = async (req: Request, res: Response): Promise<void> => { 
//   try {
//     const { matchId, firstTeamScore, secondTeamScore, firstTeamWickets, secondTeamWickets, winner, firstTeamPlayers, secondTeamPlayers } = req.body;

//     // Find the match by matchId
//     const match = await Match.findOne({ matchId });

//     if (!match) {
//       res.status(404).json({ message: 'Match not found' });
//       return;
//     }

//     // Update match-level scores and result
//     match.firstTeamScore = firstTeamScore ?? match.firstTeamScore;
//     match.secondTeamScore = secondTeamScore ?? match.secondTeamScore;
//     match.firstTeamWickets = firstTeamWickets ?? match.firstTeamWickets;
//     match.secondTeamWickets = secondTeamWickets ?? match.secondTeamWickets;
//     match.winner = winner ?? match.winner;

//     // Update player stats if provided, and send updates to Player Microservice
//     if (firstTeamPlayers && firstTeamPlayers.length === 11) {
//       match.firstTeamPlayers = firstTeamPlayers.map((player: any, index: number) => {
//         const updatedPlayer = {
//           playerId: player.playerId || match.firstTeamPlayers[index].playerId,
//           playerName: player.playerName || match.firstTeamPlayers[index].playerName,
//           runs: player.runs !== undefined ? player.runs : match.firstTeamPlayers[index].runs,
//           wickets: player.wickets !== undefined ? player.wickets : match.firstTeamPlayers[index].wickets,
//         };

//         // Update player stats in Player Microservice
//         updatePlayerStats(updatedPlayer.playerId, updatedPlayer.runs, updatedPlayer.wickets);
        
//         return updatedPlayer;
//       });
//     }

//     if (secondTeamPlayers && secondTeamPlayers.length === 11) {
//       match.secondTeamPlayers = secondTeamPlayers.map((player: any, index: number) => {
//         const updatedPlayer = {
//           playerId: player.playerId || match.secondTeamPlayers[index].playerId,
//           playerName: player.playerName || match.secondTeamPlayers[index].playerName,
//           runs: player.runs !== undefined ? player.runs : match.secondTeamPlayers[index].runs,
//           wickets: player.wickets !== undefined ? player.wickets : match.secondTeamPlayers[index].wickets,
//         };

//         // Update player stats in Player Microservice
//         updatePlayerStats(updatedPlayer.playerId, updatedPlayer.runs, updatedPlayer.wickets);

//         return updatedPlayer;
//       });
//     }

//     // Save the updated match
//     const updatedMatch = await match.save();
//     res.status(200).json(updatedMatch);

//   } catch (error) {
//     res.status(500).json({ message: 'Error updating match scores', error });
//   }
// };


//display the total matches available

export const getAllMatchDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const matches = await Match.find();

    if (!matches || matches.length === 0) {
      res.status(404).json({ message: 'No matches found' });
      return;
    }

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching match details', error });
  }
};


//it is only the match details for the particular matchid
export const getMatchDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;

    const match = await Match.findOne({ matchId });

    if (!match) {
      res.status(404).json({ message: 'Match not found' });
      return;
    }

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching match details', error });
  }
};

const TEAM_MICROSERVICE_URL = 'http://localhost:5000/api'; // Replace with actual URL  http://localhost:5000/api/teams/teamA/update-stats
const PLAYER_MICROSERVICE_URL = 'http://localhost:8000' 


export const createMatch = async (req: Request, res: Response): Promise<void> => {
  // Destructure additional fields from the request body
  const { 
    matchId, 
    matchNumber, 
    matchType, 
    tournamentId, 
    firstTeamId, 
    secondTeamId, 
    matchDate, // Added matchDate
    matchTime, // Added matchTime
    location, // Added location
    status // Added status
  } = req.body;

  try {
    // Get player IDs for the first team /:teamId/players
    const firstTeamResponse = await axios.get(`${TEAM_MICROSERVICE_URL}/${firstTeamId}/players`);
    const firstTeamPlayerIds = firstTeamResponse.data.players;

    // Get player IDs for the second team
    const secondTeamResponse = await axios.get(`${TEAM_MICROSERVICE_URL}/${secondTeamId}/players`);
    const secondTeamPlayerIds = secondTeamResponse.data.players;

    // Fetch player details for the first team /player/:player_id
    const firstTeamPlayers = await Promise.all(
      firstTeamPlayerIds.map(async (playerId: string) => {
        const playerResponse = await axios.get(`${PLAYER_MICROSERVICE_URL}/player/${playerId}`);
        return {
          playerId: playerResponse.data.playerId,
          playerName: playerResponse.data.playerName,
          runs: 0,
          wickets: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          catches: 0,
          strikeRate: 0,
        };
      })
    );

    // Fetch player details for the second team
    const secondTeamPlayers = await Promise.all(
      secondTeamPlayerIds.map(async (playerId: string) => {
        const playerResponse = await axios.get(`${PLAYER_MICROSERVICE_URL}/player/${playerId}`);
        return {
          playerId: playerResponse.data.playerId,
          playerName: playerResponse.data.playerName,
          runs: 0,
          wickets: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          catches: 0,
          strikeRate: 0,
        };
      })
    );

    // Create the match document with all required fields
    const match = new Match({
      matchId,
      matchNumber,
      matchType,
      tournamentId,
      firstTeamId,
      secondTeamId,
      matchDate, // Include matchDate
      matchTime, // Include matchTime
      location, // Include location
      status, // Include status
      firstTeamPlayers,
      secondTeamPlayers,
    });

    // Save the match
    await match.save();

    res.status(201).json({ message: 'Match created successfully', match });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMatchInfo = async (req: Request, res: Response): Promise<void> => {
  const { matchId, seriesId } = req.params;
  const {
    matchNumber,
    matchType,
    tournamentId,
    firstTeamId,
    secondTeamId,
    firstTeamScore,
    secondTeamScore,
    firstTeamWickets,
    secondTeamWickets,
    status,
    winner,
  } = req.body;

  try {
    // Find the match by matchId and seriesId
    console.log(matchId, seriesId);
    const match = await Match.findOne({ matchId: matchId, tournamentId: seriesId });
    if (!match) {
      res.status(404).json({ message: 'Match not found' });
      return;
    }

    // Update only the provided fields
    if (matchNumber !== undefined) match.matchNumber = matchNumber;
    if (matchType !== undefined) match.matchType = matchType;
    if (tournamentId !== undefined) match.tournamentId = tournamentId;
    if (firstTeamId !== undefined) match.firstTeamId = firstTeamId;
    if (secondTeamId !== undefined) match.secondTeamId = secondTeamId;
    if (firstTeamScore !== undefined) match.firstTeamScore = firstTeamScore;
    if (secondTeamScore !== undefined) match.secondTeamScore = secondTeamScore;
    if (firstTeamWickets !== undefined) match.firstTeamWickets = firstTeamWickets;
    if (secondTeamWickets !== undefined) match.secondTeamWickets = secondTeamWickets;
    if (status !== undefined) match.status = status;
    if (winner !== undefined) match.winner = winner;

    console.log('Received update for match:');
    console.log(`matchNumber: ${match.matchNumber}`);
    console.log(`matchType: ${match.matchType}`);
    console.log(`tournamentId: ${match.tournamentId}`);
    console.log(`firstTeamId: ${match.firstTeamId}`);
    console.log(`secondTeamId: ${match.secondTeamId}`);
    console.log(`firstTeamScore: ${match.firstTeamScore}`);
    console.log(`secondTeamScore: ${match.secondTeamScore}`);
    console.log(`firstTeamWickets: ${match.firstTeamWickets}`);
    console.log(`secondTeamWickets: ${match.secondTeamWickets}`);
    console.log(`status: ${match.status}`);
    console.log(`winner: ${winner}`);

    // If winner is 'Tie', update matchesPlayed for both teams
    if (winner === 'Tie') {
      console.log("It's a tie, updating matches played for both teams.");

      // Call team microservice to update stats for both teams
      await axios.put(`${TEAM_MICROSERVICE_URL}/teams/${match.firstTeamId}/update-stats`, {
        wins:0,
        matchesPlayed: 1,
      });

      await axios.put(`${TEAM_MICROSERVICE_URL}/teams/${match.secondTeamId}/update-stats`, {
        wins:0,
        matchesPlayed: 1,
      });

      // Set winner to 'Tie'
      match.winner = 'Tie';
    } else if (winner && (winner === match.firstTeamId || winner === match.secondTeamId)) {
      console.log("inside winner if");
      const losingTeamId = winner === match.firstTeamId ? match.secondTeamId : match.firstTeamId;

      console.log("Winner detected:", winner);
      // Call team microservice to update winner stats
      await axios.put(`${TEAM_MICROSERVICE_URL}/teams/${winner}/update-stats`, {
        wins: 1,
        matchesPlayed: 1,
      });

      // Call team microservice to update loser stats
      await axios.put(`${TEAM_MICROSERVICE_URL}/teams/${losingTeamId}/update-stats`, {
        losses: 1,
        matchesPlayed: 1,
      });

      // Update the match's winner field
      match.winner = winner;
    } else if (winner !== undefined) {
      // Update winner directly if it's not a team ID but specified
      match.winner = winner;
    }

    // Save the updated match document
    await match.save();

    res.status(200).json({ message: 'Match and team information updated successfully', match });
  } catch (error) {
    console.error('Error updating match information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

    // Save the updated match document
  //   await match.save();

  //   res.status(200).json({ message: 'Match information updated successfully', match });
  // } catch (error) {
  //   console.error('Error updating match information:', error);
  //   res.status(500).json({ message: 'Internal server error' });
  // }



//updating the match player information (4s,6s etc)
export const updatePlayerStats = async (req: Request, res: Response): Promise<void> => {
  const { matchId, seriesId } = req.params;
  console.log(req.params);
  const { playerId, playerName, runs, wickets, balls, fours, sixes, catches, strikeRate } = req.body;

  try {
    console.log(matchId,seriesId);
    // Step 1: Find the match by matchId and seriesId
  //  const match = await Match.findOne({ matchId, seriesId });
  const match = await Match.findOne({ matchId: matchId, tournamentId: seriesId });
  if (match) {
    // Ensure matchType and matchNumber have values, or set them to defaults
    match.matchType = match.matchType || 'group';
    match.matchNumber = match.matchNumber || '0';
  }
    console.log("match value : " + match);
    if (!match) {
      res.status(404).json({ message: 'Match not found' });
      return;
    }

    // Step 2: Find player in the match (from either team)
    const playerInFirstTeam = match.firstTeamPlayers.find((p: any) => p.playerId === playerId);
    const playerInSecondTeam = match.secondTeamPlayers.find((p: any) => p.playerId === playerId);
    const player = playerInFirstTeam || playerInSecondTeam;
    console.log(player);
    if (!player) {
      res.status(404).json({ message: 'Player not found in this match' });
      return;
    }

    // Step 3: Update player stats in the Player microservice http://localhost:8000/api/players/:playerId/stats'
    if (balls > 0) {
      player.strikeRate = (runs / balls) * 100;
    } else {
      player.strikeRate = 0;
    }
    await axios.put(`${PLAYER_MICROSERVICE_URL}/players/${playerId}/stats`, {
      runs: runs !== undefined ? runs :0,
      wickets: wickets !== undefined ? wickets : 0,
      balls: balls !== undefined ? balls : 0,
      fours: fours !== undefined ? fours :0,
      sixes: sixes !== undefined ? sixes : 0,
      catches: catches !== undefined ? catches : 0,
      strikeRate: player.strikeRate !== 0 ? player.strikeRate : 0,
    });

    // Step 4: Update player stats in the match document
    console.log(balls +''+fours +''+sixes +''+strikeRate);
    player.balls = player.balls || 0;
    player.fours = player.fours || 0;
    player.sixes = player.sixes || 0;
    player.catches = player.catches || 0;
    
    // Now perform the increments
    player.balls += balls;
    player.fours += fours;
    player.sixes += sixes;
    player.catches += catches;

      

    if (playerInFirstTeam) {
      match.markModified('firstTeamPlayers');
    } else if (playerInSecondTeam) {
      match.markModified('secondTeamPlayers');
    }
   
    // Save the updated match document
    await match.save();

    res.status(200).json({ message: 'Player statistics updated successfully', match });
  } catch (error) {
    console.error('Error updating player stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// to get the player matchs status like ongoing, upcomming and completed
export const getUpcomingMatches = async (req: Request, res: Response): Promise<void> => {
  const { playerId } = req.params;
  //console.log(playerId);

  try {
    const upcomingMatches = await Match.find({
      status: 'upcoming',
      $or: [
        { 'firstTeamPlayers.playerId': playerId },
        { 'secondTeamPlayers.playerId': playerId }
      ]
    });
    console.log(upcomingMatches);

    if (upcomingMatches.length === 0) {
      res.status(200).json({ message: 'No upcoming  matches found for this player' });
      return;
    }

    res.status(200).json({ message: 'Upcoming matches found', upcomingMatches });
    return;
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch ongoing matches for a specific player
export const getOngoingMatches = async (req: Request, res: Response): Promise<void> => {
  const { playerId } = req.params;

  try {
    const ongoingMatches = await Match.find({
      status: 'ongoing',
      $or: [
        { 'firstTeamPlayers.playerId': playerId },
        { 'secondTeamPlayers.playerId': playerId }
      ]
    });

    if (ongoingMatches.length === 0) {
      res.status(200).json({ message: 'No Ongoing matches found for this player' });
      return;
    }

    res.status(200).json({ message: 'Ongoing matches found', ongoingMatches });
  } catch (error) {
    console.error('Error fetching ongoing matches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCompletedMatches = async (req: Request, res: Response): Promise<void> => {
  const { playerId } = req.params;

  try {
    const completedMatches = await Match.find({
      status: 'completed',
      $or: [
        { 'firstTeamPlayers.playerId': playerId },
        { 'secondTeamPlayers.playerId': playerId }
      ]
    });

    if (completedMatches.length === 0) {
      res.status(200).json({ message: 'No completed matches found for this player' });
      return;
    }

    res.status(200).json({ message: 'Completed matches found', completedMatches });
  } catch (error) {
    console.error('Error fetching completed matches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getMatchDetailsByTournamentId = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = req.params; // Get the tournamentId from the request parameters

  try {
    const matches = await Match.find({ tournamentId }); // Query matches by tournamentId

    if (!matches || matches.length === 0) {
      res.status(404).json({ message: 'No matches found for this tournament' });
      return;
    }

    res.status(200).json(matches); // Return the matches found
  } catch (error) {
    console.error('Error fetching matches by tournament ID:', error);
    res.status(500).json({ message: 'Error fetching matches by tournament ID', error });
  }
};




