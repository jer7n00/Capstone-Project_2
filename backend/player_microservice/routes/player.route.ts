import { Router } from 'express';
import * as PlayerController from '../controller/player.controller';

const router = Router();

router.post('/', PlayerController.createPlayer);
router.get('/', PlayerController.getPlayers);
router.get('/player_id/:player_id', PlayerController.getPlayer); // Update here
router.put('/player_id/:player_id', PlayerController.updatePlayer); // Update here
router.delete('/player_id/:player_id', PlayerController.deletePlayer); // Update here
router.post('/register/:playerId/:teamId', PlayerController.registerPlayerToTeam); //player to team registered player
router.get('/user_id/:user_id',PlayerController.getPlayerIdfromUserId);
router.put('/players/:player_id/stats', PlayerController.updatePlayerStats); //http://localhost:8000/api/players/:playerId/stats'
router.get('/player/:player_id',PlayerController.getPlayerIdplayernamefromplayerid);
//http://localhost:3001/api/players/${playerId}/stats
router.put('/update-team/:player_id', PlayerController.updateTeamId);

//this route is update the player information from organizer microservice when the match details get updated
router.put('/player/:playerId/stats', PlayerController.updatePlayerStats);
router.get('/player/:player_id/stats', PlayerController.getPlayerStats);


export default router;
