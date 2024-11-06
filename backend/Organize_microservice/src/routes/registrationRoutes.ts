import { Router } from 'express';
import { registerTeam, getRegisteredTeams, acceptTeam, rejectTeam } from '../controllers/registrationController';

const router = Router();

router.post('/teams', registerTeam); // Register a team
router.get('/teams', getRegisteredTeams); // Get registered teams
router.post('/teams/accept', acceptTeam); // Accept a team
router.post('/teams/reject', rejectTeam); // Reject a team

export default router;
