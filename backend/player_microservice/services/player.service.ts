import axios from 'axios'; // Use axios to make HTTP requests
import Player, { PlayerInterface } from '../model/player.model'; // Import your Player model and interface

// Create a new player
export const createPlayer = async (playerData: Omit<PlayerInterface, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlayerInterface> => {
    const player = new Player(playerData);
    await player.save(); // Await the save operation
    return player;
};


// Get all players
export const getPlayers = async (): Promise<PlayerInterface[]> => {
    return await Player.find();
};

// Get a single player by ID
export const getPlayerById = async (id: string): Promise<PlayerInterface | null> => {
    return await Player.findById(id);
};

// Get a single player by player_id
export const getPlayerByPlayerId = async (player_id: string): Promise<PlayerInterface | null> => {
    return await Player.findOne({ player_id }); // Search using the player_id field
};

// Update a player
export const updatePlayer = async (id: string, playerData: Partial<Omit<PlayerInterface, '_id' | 'createdAt' | 'updatedAt'>>): Promise<PlayerInterface | null> => {
    return await Player.findByIdAndUpdate(id, playerData, { new: true });
};

// Delete a player
export const deletePlayer = async (id: string): Promise<void> => {
    await Player.findByIdAndDelete(id);
};


export const registerPlayerToTeam = async (playerId: string, teamId: string) => {
    console.log(playerId);
    console.log(teamId);
    try {

        // Send the playerId and teamId to the Team microservice /teams/register-player /teams/register-player
        const response = await axios.post('http://localhost:5000/api/teams/register-player', {
            playerId,
            teamId,
        });
        
        return response.data; // Return response from Team microservice
    } catch (error) {
        throw new Error('Error registering player to team');
    }
};

export const getPlayerIdFromUserId=async (user_id:string) => {
    try {
      // Find the player document that matches the user ID
      
      const player = await Player.findOne({ user_id: user_id });
      
      // If no player is found, return null
      if (!player) return null;
      
      // Return the player_id from the player document
      return player.player_id;
    } catch (error) {
      console.error('Error in PlayerService.getPlayerIdFromUserId:', error);
      throw error;
    }
  };

  export const updatePlayerTeamId = async (player_id: string, teamId: string) => {
    return await Player.findOneAndUpdate(
      { player_id: player_id }, // Find by player_id instead of _id
      { teamId: teamId },
      { new: true, fields: { teamId: 1, player_id: 1 } } // Return only updated teamId and player_id fields
    );
  };
  