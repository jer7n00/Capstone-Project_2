"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPlayerRequest = exports.getRegisteredPlayers = exports.addRegisteredPlayer = exports.fetchTeamStatistics = void 0;
const teamService_1 = require("../services/teamService");
const fetchTeamStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const team = yield (0, teamService_1.getTeamStatistics)(req.params.teamId);
        res.status(200).json(team);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching team statistics', error });
    }
});
exports.fetchTeamStatistics = fetchTeamStatistics;
// need to pass in player microservice to register in this teams
const addRegisteredPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registeredPlayer = yield (0, teamService_1.registerPlayer)(req.body);
        res.status(201).json(registeredPlayer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering player', error });
    }
});
exports.addRegisteredPlayer = addRegisteredPlayer;
const getRegisteredPlayers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registeredPlayers = yield (0, teamService_1.listRegisteredPlayers)(req.params.teamId);
        res.status(200).json(registeredPlayers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching registered players', error });
    }
});
exports.getRegisteredPlayers = getRegisteredPlayers;
//like button accept or reject in front dependices on front end [returned meesage(String)]
const processPlayerRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playerId, teamId } = req.body;
    const action = req.params.action;
    try {
        yield (0, teamService_1.handlePlayerAcceptance)(playerId, teamId, action);
        res.status(200).json({ message: `Player ${action}ed successfully` });
    }
    catch (error) {
        res.status(500).json({ message: `Error processing player ${action}`, error });
    }
});
exports.processPlayerRequest = processPlayerRequest;
