// controllers/teamController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import {
  getTeamStatistics,
  registerPlayer,
  listRegisteredPlayers,
  
  createTeam,
 // getTeamDetails,
  // getTeamById,
  sendTeamToOrganizer,
} from '../services/teamService';
import Team from '../models/Team';
import RegisteredPlayer from '../models/RegisteredPlayer';

//creating the team route handlers
export const createNewTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTeam = await createTeam(req.body);
    console.log('Team created successfully:', newTeam);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error });
  }
};



//send the team details to tournament microservice
export const registerTeamWithOrganizer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId, tournamentId } = req.body;
   // http://localhost:3000/api/registrations 
    // Forward the registration request to the organizer microservice
    const response = await axios.post(`${process.env.ORGANIZER_SERVICE_URL}/teams`, {
      teamId,
      tournamentId
    });

    // Send the response back to the client
    res.status(response.status).json(response.data);
  } catch (error: any) {
     
    res.status(error.response?.status || 500).json({
      message: 'Error registering team with organizer',
      error: error.response?.data || error.message,
    });
  }};

export const fetchTeamStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const team = await getTeamStatistics(req.params.teamId);
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team statistics', error });
  }
};


// need to pass in player microservice to register in this teams
export const addRegisteredPlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const registeredPlayer = await registerPlayer(req.body);
    res.status(201).json(registeredPlayer);
  } catch (error) {
    res.status(500).json({ message: 'Error registering player', error });
  }
};

export const getRegisteredPlayers = async (req: Request, res: Response): Promise<void> => {
  try {
    const registeredPlayers = await listRegisteredPlayers(); // Fetch all registered players
    res.status(200).json(registeredPlayers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registered players', error });
  }
};




// Fetch all tournaments from the organizer microservice
export const fetchTournamentsFromOrganizer = async (req: Request, res: Response): Promise<void> => {
  try {
    // Make a GET request to the organizer microservice's tournaments endpoint
    const response = await axios.get(`http://localhost:3000/api/tournaments`);
     
    // Forward the response data to the client
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      message: 'Error fetching tournaments from organizer',
      error: error.response?.data || error.message,
    });
  }
};

// this can we get accessed by tournament 
export const getTeamById = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;

  try {
    // Fetch team details from the database
    const team = await Team.findOne({ teamId });

    if (!team) {

      res.status(404).json({ message: 'Team not found' });
      return;
    }

    // Respond with team details
    res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team details:', error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
};


// getting playerid and teamid from player microservice
export const registerPlayerdetails = async (req: Request, res: Response): Promise<void> => {
  const { playerId, teamId } = req.body;

  try {
      // Check if this player is already registered for the team to avoid duplicates
      const existingRegistration = await RegisteredPlayer.findOne({ playerId, teamId });
      
      if (existingRegistration) {
          res.status(409).json({ message: 'Player is already registered for this team' });
          return;
      }

      // Create a new registration record
      const registeredPlayer = new RegisteredPlayer({ playerId, teamId });
      await registeredPlayer.save();

      res.status(201).json({ message: 'Player registered to team successfully', registeredPlayer });
  } catch (error) {
      console.error('Error registering player:', error);
      res.status(500).json({ message: 'Error registering player to team', error: (error as Error).message });
  }
};


//get  the players id from teamid

export const getPlayersByTeamId = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;

  try {
    const team = await Team.findOne({ teamId });
    
    if (!team) {
      // If no team is found, send a 404 response and return early
       res.status(404).json({ message: 'Team not found' });
       return;
    }

    // Only reaches this line if `team` is not null
    res.status(200).json({ players: team.players });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const assignPlayerToTeam = async (req: Request, res: Response): Promise<void> => {
  const { playerId, teamId } = req.params;

  try {
    // Find and delete the player from Registered database
    const registeredPlayer = await RegisteredPlayer.findOneAndDelete({ playerId, teamId });
    
    if (!registeredPlayer) {
      res.status(404).json({ message: 'Player not found in Registered database' });
      return;
    }

    // Find the team and add the player to playerList
    const team = await Team.findOneAndUpdate(
      { teamId },
      { $addToSet: { players: playerId } }, // Add player if not already in the list
      { new: true, upsert: true } // Create team if it doesn't exist
    );

    // Update player's teamId in player microservice
    try {
      const playerMicroserviceUrl = `http://localhost:8000/update-team/${playerId}`;
      await axios.put(playerMicroserviceUrl, { teamId }, {
        headers: {
          Authorization: `Bearer ${req.headers.authorization}`, // Pass the auth token if needed
        },
      });
    } catch (playerError) {
      console.error('Error updating player teamId in player microservice:', playerError);
      res.status(500).json({ message: 'Failed to update player in player microservice' });
      return;
    }

    res.status(200).json({
      message: 'Player added to team and removed from Registered database',
      team
    });
  } catch (error) {
    console.error('Error assigning player to team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// delete the playerid and teamid from the registered database ( DELETE BUTTON)
export const deletePlayerFromRegistered = async (req: Request, res: Response): Promise<void> => {
  const { playerId } = req.params;

  try {
    const deletedPlayer = await RegisteredPlayer.findOneAndDelete({ playerId });

    if (!deletedPlayer) {
      res.status(404).json({ message: 'Player not found in Registered database' });
      return;
    }

    res.status(200).json({ message: 'Player removed from Registered database' });
  } catch (error) {
    console.error('Error deleting player from Registered database:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//updating the team stats when winner is announced in organization microservices
// Endpoint: PUT /teams/:teamId/update-stats
export const updateTeamStats = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;
  const { wins = 0, losses = 0, matchesPlayed = 0 } = req.body;

  try {
    // Find the team by teamId
    const team = await Team.findOne({teamId});
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    // Update the team statistics by incrementing the provided values
    team.wins += wins;
    team.losses += losses;
    team.noOfMatches += matchesPlayed;

    // Save the updated team document
    await team.save();

    res.status(200).json({ message: 'Team statistics updated successfully', team });
  } catch (error) {
    console.error('Error updating team statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//updating the team's seriesid when adding the team or updating the tournaments
export const updateSeriesId = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;
  const { seriesId } = req.body; //seriesId
  console.log('seriesId:', seriesId);

  try {
    
    const team = await Team.findOneAndUpdate(
      { teamId: teamId }, // Use teamId field here
      { seriesId },
      { new: true, runValidators: true }
    );

    console.log(team);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.status(200).json({ message: 'Team seriesId updated successfully', team });
  } catch (error) {
    console.error('Error updating team seriesId:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const getTeamsByTournamentId = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = req.params;

  try {
    // Find all teams with the matching seriesId (tournamentId)
    const teams = await Team.find({ seriesId: tournamentId });

    if (teams.length === 0) {
      res.status(200).json({ message: 'No teams found for this tournament' });
      return;
    }

    // Send the teams data as the response
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams by tournament ID:', error);
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};

// controllers/teamController.ts
export const getTeamsByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    // Assuming you have a field `userId` in your Team model that associates teams with users
    const teams = await Team.find({ userId }); // Adjust if your team model uses a different field for user association
    
    if (teams.length === 0) {
      res.status(200).json({ message: 'No teams found for this user' }); // Send message without 404
      return;
    }

    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams by userId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
