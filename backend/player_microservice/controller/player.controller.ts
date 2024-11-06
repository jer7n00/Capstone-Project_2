import { Request, Response } from 'express';
import * as PlayerService from '../services/player.service'; // Import the PlayerService
import player,{ PlayerInterface } from '../model/player.model'; // Import your Player interface
import Player from '../model/player.model';
 
// Create a new player
export const createPlayer = async (req: Request, res: Response): Promise<void> => {
    try {
        const player: PlayerInterface = await PlayerService.createPlayer(req.body);
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error creating player' });
    }
};

export const getPlayerById = async (req: Request, res: Response): Promise<void> => {
    const { playerId } = req.params;
  
    try {
      const player = await Player.findOne({ playerId });
  
      if (!player) {
        res.status(404).json({ message: 'Player not found' });
        return;
      }
  
      // Return playerId and playerName
      res.status(200).json({
        playerId: player.player_id,
        playerName: player.name,
      });
    } catch (error) {
      console.error('Error fetching player:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Get all players
export const getPlayers = async (req: Request, res: Response): Promise<void> => {
    try {
        const players: PlayerInterface[] = await PlayerService.getPlayers();
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching players' });
    }
};

// Get a single player by player_id
export const getPlayer = async (req: Request, res: Response): Promise<void> => {
    try {
        const playerId = req.params.player_id; // Get player_id from the request parameters
        const player: PlayerInterface | null = await PlayerService.getPlayerByPlayerId(playerId); // Call a new service method
        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return; // Ensure to return after sending a response
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching player' });
    }
};

// Update a player by player_id
export const updatePlayer = async (req: Request, res: Response): Promise<void> => {
    try {
        const playerId = req.params.player_id; // Get player_id from the request parameters
        console.log(playerId);
        const player: PlayerInterface | null = await PlayerService.updatePlayer(playerId, req.body);
        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error updating player' });
    }
};

// Delete a player by player_id
export const deletePlayer = async (req: Request, res: Response): Promise<void> => {
    try {
        await PlayerService.deletePlayer(req.params.player_id);
        res.json({ message: 'Player deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting player' });
    }
};



export const registerPlayerToTeam = async (req: Request, res: Response): Promise<void> => {
    const { playerId, teamId } = req.params; // Extract playerId and teamId from the URL

    try {
        // Send playerId and teamId to the Team microservice
        const result = await PlayerService.registerPlayerToTeam(playerId, teamId);
        res.status(200).json(result); // Send the successful response back to the client
    } catch (error) {
        res.status(500).json({ message: 'Error registering player to team', error });
    } 
};






// this end will be auto triggered from organizer micro when player score is updated in match table
// export const updatePlayerStats = async (req: Request, res: Response): Promise<void> => {
//     const { player_id } = req.params;
//     const { runs, wickets } = req.body;

//     console.log("Player ID from request:", player_id); // Log the player ID
//     console.log("Runs to update:", runs);
//     console.log("Wickets to update:", wickets);

//     try {
//         // Find the player by playerId
//         const player = await Player.findOne({ player_id: player_id });
//         console.log("Player:", player); // Log the found player
        
//         if (!player) {
//             res.status(404).json({ message: 'Player not found' });
//             return;
//         }

//         // Update player stats in battingStats and bowlingStats
//         if (runs !== undefined) {
//             player.battingStats = {
//                 ...player.battingStats,
//                 runs: (player.battingStats?.runs || 0) + runs,
//                 matchesPlayed: (player.battingStats?.matchesPlayed || 0) + 1,
//             };
//         }
        
//         if (wickets !== undefined) {
//             player.bowlingStats = {
//                 ...player.bowlingStats,
//                 wickets: (player.bowlingStats?.wickets || 0) + wickets,
//                 matchesPlayed: (player.bowlingStats?.matchesPlayed || 0) + 1,
//             };
//         }

//         await player.save();
//         res.status(200).json(player);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating player stats', error });
//     }
// };



export const getPlayerIdplayernamefromplayerid = async (req: Request, res: Response): Promise<void> => {
    const { player_id } = req.params;
    console.log('Request URL:', req.originalUrl);  // Log the original URL
  console.log('Request Params:', req.params);   
    console.log('Received playerId:', player_id);
    try {
      const player = await Player.findOne({ player_id });
  
      if (!player) {
        res.status(404).json({ message: 'Player not found' });
        return;
      }
  
      // Return playerId and playerName
      res.status(200).json({
        playerId: player.player_id,
        playerName: player.name,
      });
    } catch (error) {
      console.error('Error fetching player:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPlayerIdfromUserId = async (req:Request, res:Response): Promise<void> => {
    const { user_id } = req.params;
    
    try {
      const playerId = await PlayerService.getPlayerIdFromUserId(user_id);
      
      if (!playerId) {
         res.status(404).json({ message: 'Player not found for the given user ID.' });
         return;
      }

       res.status(200).json({ player_id: playerId });
       return;
    } catch (error) {
      console.error('Error fetching player ID:', error);
       res.status(500).json({ message: 'Internal server error.' });
      return
    }
  };

// it is used by organizer microseriver to update the player stats
  export const updatePlayerStats = async (req: Request, res: Response): Promise<void> => {
    const {  player_id } = req.params; // Get playerId from route parameters
    console.log('request params' +req.params);
    const {
      runs,
      wickets,
      balls,
      fours,
      sixes,
      catches,
      strikeRate,
    } = req.body;
  
    try {
      // Find the player by playerId
      console.log('playerid details'+player_id);
      const player = await Player.findOne({ player_id: player_id });
      console.log(player);
      if (!player) {
        res.status(404).json({ message: 'Player not found' });
        return;
      }
  
      // Update only the provided fields
      if (!player.battingStats) {
        player.battingStats = {}; // Initialize if undefined
    }
    if (!player.bowlingStats) {
        player.bowlingStats = {}; // Initialize if undefined
    }
    
    // Now safely update the fields
    if (runs !== undefined) {
        player.battingStats.runs = (player.battingStats.runs ?? 0) + runs; // Add runs to existing
    }
    if (wickets !== undefined) {
        player.bowlingStats.wickets = (player.bowlingStats.wickets ?? 0) + wickets; // Add wickets to existing
    }
    if (balls !== undefined) {
        player.battingStats.matchesPlayed = (player.battingStats.matchesPlayed ?? 0) + 1; // Increment matches played if balls are provided
    }
    if (fours !== undefined) {
        player.battingStats.fours = fours; // Update fours
    }
    if (sixes !== undefined) {
        player.battingStats.sixes = sixes; // Update sixes
    }
    if (catches !== undefined) {
        player.bowlingStats.catches = catches; // Update catches
    }
    if (strikeRate !== undefined) {
        player.battingStats.strikeRate = strikeRate; // Update strike rate
    }
      // Save the updated player document
      await player.save(); // saving the player information to database 
  
      res.status(200).json({ message: 'Player statistics updated successfully', player });
    } catch (error) {
      console.error('Error updating player statistics:', error);
      res.status(500).json({ message: 'Internal server error from player microservice' });
    }
  };

  export const updateTeamId = async (req:Request, res:Response): Promise<void> => {
    const { player_id } = req.params;
    const { teamId } = req.body;
  
    if (!teamId) {
     res.status(400).json({ message: 'teamId is required' });
     return;
    }
  
    try {
      const updatedPlayer = await PlayerService.updatePlayerTeamId(player_id, teamId);
      if (updatedPlayer) {
        res.status(200).json({ message: 'teamId updated successfully', updatedPlayer });
      } else {
        res.status(404).json({ message: 'Player not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating teamId', error });
    }
  };
  



// team -> players 
// team -> matches

export const getPlayerStats = async (req: Request, res: Response): Promise<void> => {
  const { player_id } = req.params; // Get player_id from the request parameters

  try {
      // Find the player by player_id
      const player = await Player.findOne({ player_id });

      if (!player) {
          res.status(404).json({ message: 'Player not found' });
          return;
      }

      // Return the player's stats (battingStats and bowlingStats)
      res.status(200).json({
          playerId: player.player_id,
          name: player.name,
          battingStats: player.battingStats || {},  // Return empty object if no battingStats
          bowlingStats: player.bowlingStats || {}   // Return empty object if no bowlingStats
      });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching player stats', error });
  }
};