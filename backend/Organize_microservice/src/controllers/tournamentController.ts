import { Request, Response, Router } from 'express';
import Tournament from '../models/Tournament';
import axios from 'axios';

const router = Router();

// Create a new tournament
// export const createTournament = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const tournament = new Tournament(req.body);
//     await tournament.save();
//     res.status(201).json(tournament);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating tournament', error });
//   }
// };
 const TEAM_MICROSERVICE_URL='http://localhost:5000/api/teamsTournament'; // http://localhost:5000/api/teamsTournament/teamB/series
//helper function to update the seriesid to the teamid
async function updateTeamSeriesId(teamId: string, seriesId: string): Promise<void> {
  try {
    // Make a PUT request to the team microservice to update the seriesId for the specified team
    console.log(teamId, seriesId);
    await axios.put(`${TEAM_MICROSERVICE_URL}/${teamId}/series`, { seriesId });
  } catch (error) {
    console.error('Error updating team seriesId:', error);
    throw new Error('Failed to update team seriesId');
  }
}


export const createOrUpdateTournament = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      user_id,
      tournamentId,
      tournamentName,
      startDate,
      endDate,
      noOfOvers,
      registrationDeadline,
      rulesAndRegulations,
      organizerName,
      venue,
      winnerTeam,
      noOfTeams,
      status,
      teams,
    } = req.body;

    // Create or update the tournament
    const tournament = await Tournament.findOneAndUpdate(
      { tournamentId }, // Find tournament by its ID
      {
        user_id,
        tournamentId,
        tournamentName,
        startDate,
        endDate,
        noOfOvers,
        registrationDeadline,
        rulesAndRegulations,
        organizerName,
        venue,
        winnerTeam,
        noOfTeams,
        status,
        teams,
      },
      { new: true, upsert: true, runValidators: true } // Upsert to create if not exists
    );

    // Update each team’s seriesId if the list of teams is provided
    if (teams && Array.isArray(teams)) {
      await Promise.all(
        teams.map(async (teamId: string) => {
          if (teamId) {
            console.log("teamId: ", teamId);
            await updateTeamSeriesId(teamId, tournament?.tournamentId);
          }
        })
      );
    }

    res.status(201).json({
      message: 'Tournament created/updated successfully',
      tournament,
    });
  } catch (error) {
    console.error('Error creating or updating tournament:', error);
    res.status(500).json({ message: 'Error creating/updating tournament or updating teams', error });
  }
};


//fetching the tournament with user_id
export const getTournamentsByUserId = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.params;

  try {
    const tournaments = await Tournament.find({ user_id });
    if (tournaments.length === 0) {
      res.status(404).json({ message: 'No tournaments found for this user.' });
      return;
    }
    res.status(200).json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
//updating the tournaments details 
// export const updateTournament = async (req: Request, res: Response): Promise<void> => {
//   const { tournamentId } = req.params;
//   const updateData = req.body; // teamid , -> check that team seriesid -> if empty then update in t

//   try {
//     // Find and update the tournament with new data
//     const updatedTournament = await Tournament.findOneAndUpdate(
//       { tournamentId }, // Find tournament by tournamentId
//       { $set: updateData }, // Update with data provided in request body
//       { new: true, runValidators: true } // Return the updated document and apply schema validations
//     );

//     if (!updatedTournament) {
//       res.status(404).json({ message: 'Tournament not found' });
//       return;
//     }

//     res.status(200).json({ message: 'Tournament updated successfully', tournament: updatedTournament });
//   } catch (error) {
//     console.error('Error updating tournament:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
//   }
// };
// Update Tournament
export const updateTournament = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = req.params;
  const updateData = req.body;

  try {
    // Find and update the tournament with new data
    const updatedTournament = await Tournament.findOneAndUpdate(
      { tournamentId }, // Find tournament by tournamentId
      { $set: updateData }, // Update with data provided in request body
      { new: true, runValidators: true } // Return the updated document and apply schema validations
    );

    if (!updatedTournament) {
      res.status(404).json({ message: 'Tournament not found' });
      return;
    }

    // Check if teamId is provided in the request body
    const { teamId } = req.body;
    if (teamId) {
      // Update the seriesId of the specified team in the team microservice
      await updateTeamSeriesId(teamId, updatedTournament.tournamentId);
    }

    res.status(200).json({ message: 'Tournament updated successfully', tournament: updatedTournament });
  } catch (error) {
    console.error('Error updating tournament:', error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
};


//delete the tournament with respect to tournamentid
export const deleteTournament = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = req.params;

  try {
    // Find and delete the tournament by its ID
    const deletedTournament = await Tournament.findOneAndDelete({ tournamentId });

    if (!deletedTournament) {
      res.status(404).json({ message: 'Tournament not found' });
      return;
    }

    res.status(200).json({ message: 'Tournament deleted successfully', deletedTournament });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
};


// Fetch all tournaments
export const getTournaments = async (req: Request, res: Response): Promise<void> => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tournaments', error });
  }
};



// get the tournament by giving the tournament id

// export const getTournamentById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const tournament = await Tournament.findById(req.params.id);
//     if (!tournament) {
//       res.status(404).json({ message: 'Tournament not found' });
//       return;
//     }
//     res.status(200).json(tournament);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tournament', error });
//   }
// };


 
export const fetchTeamsForTournament = async (req: Request, res: Response) => {
  const { tournamentId } = req.params;
  console.log(tournamentId);

  try {
    // Step 1: Directly fetch the tournament details from the database
    const tournament = await Tournament.findOne({tournamentId}).select('teams'); // Assuming 'teams' is an array of team IDs

    if (!tournament || !tournament.teams || tournament.teams.length === 0) {
      res.status(404).json({ message: 'No teams found for this tournament' });
      return;
    }
    ///teams/:teamId
    // Step 2: Fetch each team's details concurrently using Promise.all
    console.log(tournament.teams.map((teamId: string) => teamId));
    const teamDetailsPromises = tournament.teams.map((teamId: string) => 
    
      axios.get(`http://localhost:5000/api/teams/${teamId}`).then(response => response.data)
    );

    const teams = await Promise.all(teamDetailsPromises);

    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams for tournament:', error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
};


export default router;



