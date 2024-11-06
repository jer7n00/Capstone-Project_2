import { Request, Response } from 'express';
import RegisteredTeam from '../models/RegisteredTeam';
import Tournament from '../models/Tournament';


// Register a team it is accessed by team microservice to register to the tournament
export const registerTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId, tournamentId } = req.body;
    const registeredTeam = new RegisteredTeam({ teamId, tournamentId });
    await registeredTeam.save();
    res.status(201).json(registeredTeam);
  } catch (error) {
    res.status(500).json({ message: 'Error registering team', error });
  }
};


// Get all registered teams
export const getRegisteredTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await RegisteredTeam.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registered teams', error });
  }
};

// Accept a team and add to tournament
export const acceptTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId, tournamentId } = req.body;
    
    // Add team to the tournament
    await Tournament.findOneAndUpdate(
      { tournamentId },
      { $addToSet: { teams: teamId } }
    );

    // Remove from registered teams
    await RegisteredTeam.deleteOne({ teamId });
    res.status(200).json({ message: 'Team accepted and added to tournament' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting team', error });
  }
};

// Reject a team
export const rejectTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.body;
    await RegisteredTeam.deleteOne({ teamId });
    res.status(200).json({ message: 'Team rejected and removed from registered list' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting team', error });
  }
};
