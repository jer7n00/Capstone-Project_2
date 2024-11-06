"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/teamRoutes.ts
const express_1 = require("express");
const teamController_1 = require("../controllers/teamController");
const router = (0, express_1.Router)();
// Team statistics endpoint
router.get('/teams/:teamId/statistics', teamController_1.fetchTeamStatistics);
// Register a player to registered_players (for Player microservice)
router.post('/teams/register-player', teamController_1.addRegisteredPlayer);
// List registered players for a team
router.get('/teams/:teamId/registered-players', teamController_1.getRegisteredPlayers);
// Accept or reject a registered player
router.post('/teams/:teamId/registered-players/:action', teamController_1.processPlayerRequest);
exports.default = router;
