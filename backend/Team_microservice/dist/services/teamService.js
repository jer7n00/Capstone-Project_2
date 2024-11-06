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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePlayerAcceptance = exports.listRegisteredPlayers = exports.registerPlayer = exports.getTeamStatistics = void 0;
// services/teamService.ts
const Team_1 = __importDefault(require("../models/Team"));
const RegisteredPlayer_1 = __importDefault(require("../models/RegisteredPlayer"));
// Fetch team statistics
const getTeamStatistics = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
    return Team_1.default.findById(teamId);
});
exports.getTeamStatistics = getTeamStatistics;
// Register a player for squad management
const registerPlayer = (playerData) => __awaiter(void 0, void 0, void 0, function* () {
    const registeredPlayer = new RegisteredPlayer_1.default(playerData);
    return registeredPlayer.save();
});
exports.registerPlayer = registerPlayer;
// List all registered players for a team
const listRegisteredPlayers = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
    return RegisteredPlayer_1.default.find({ teamId });
});
exports.listRegisteredPlayers = listRegisteredPlayers;
// Accept or reject a registered player
const handlePlayerAcceptance = (playerId, teamId, action) => __awaiter(void 0, void 0, void 0, function* () {
    const player = yield RegisteredPlayer_1.default.findOne({ playerId, teamId });
    if (!player)
        throw new Error('Player not found in registration list');
    if (action === 'accept') {
        yield Team_1.default.updateOne({ _id: teamId }, { $push: { players: { playerId: player.playerId, playerName: player.playerName, role: player.role } } });
    }
    yield RegisteredPlayer_1.default.deleteOne({ playerId, teamId });
});
exports.handlePlayerAcceptance = handlePlayerAcceptance;
