// services/teamService.ts
import Team, { TeamDocument } from '../models/Team';
import RegisteredPlayer, { IRegisteredPlayer } from '../models/RegisteredPlayer';
import axios from 'axios';


//api for creating a new team 
export const createTeam = async (teamData: TeamDocument): Promise<TeamDocument> => {
  console.log('Creating a new team:', teamData);
  const newTeam = new Team(teamData);
  return newTeam.save();
};

// Function to fetch team details by ID
export const getTeamById = async (teamId: string): Promise<TeamDocument | null> => {
  return await Team.findById(teamId);
};

// Function to send team details to Organizer microservice
export const sendTeamToOrganizer = async (team: TeamDocument): Promise<void> => {
  const organizerUrl = process.env.ORGANIZER_SERVICE_URL || 'http://localhost:6000/api/organizer/teams';

  // Send a POST request to the Organizer microservice with team details
  await axios.post(organizerUrl, {
    teamId: team.teamId,
    teamName: team.teamName,
    seriesId: team.seriesId,
  //  customer_id: team.customer_id,
    noOfMatches: team.noOfMatches,
    wins: team.wins,
    losses: team.losses,
    players: team.players,
  });
};
// Fetch details of a specific team by ID
// export const getTeamDetails = async (teamId: string): Promise<TeamDocument | null> => {
//   return Team.findById(teamId);
// };
// Fetch team statistics
export const getTeamStatistics = async (teamId: string): Promise<TeamDocument | null> => {
  return Team.findById(teamId);
};



// Register a player for squad management
export const registerPlayer = async (playerData: IRegisteredPlayer): Promise<IRegisteredPlayer> => {
  const registeredPlayer = new RegisteredPlayer(playerData);
  return registeredPlayer.save();
};

// List all registered players for a team
// export const listRegisteredPlayers = async (teamId: string): Promise<RegisteredPlayerDocument[]> => {
//   return RegisteredPlayer.find({ teamId });
// };
export const listRegisteredPlayers = async (): Promise<any[]> => {
  // Assuming you are using an ORM like Mongoose, Sequelize, etc.
  return RegisteredPlayer.find(); // Fetch all players without filtering by team ID
};

// Accept or reject a registered player
// export const handlePlayerAcceptance = async (playerId: string, teamId: string, action: 'accept' | 'reject') => {
//   const player = await RegisteredPlayer.findOne({ playerId, teamId });
//   if (!player) throw new Error('Player not found in registration list');

//   if (action === 'accept') {
//     await Team.updateOne(
//       { _id: teamId },
//       { $push: { players: { playerId: player.playerId, playerName: player.playerName, role: player.role } } }
//     );
//   }
//   await RegisteredPlayer.deleteOne({ playerId, teamId });
// };
