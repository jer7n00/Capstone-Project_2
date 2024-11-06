import mongoose, { Schema, Document } from 'mongoose';

export interface Player extends Document {
  playerId: string;
  playerName: string;
  runs: number;
  wickets: number;
  balls: number;
  fours: number;
  sixes: number;
  catches: number;
  strikeRate: number;
}

const playerSchema: Schema = new Schema({
  playerId: { type: String, required: true },
  playerName: { type: String, required: true },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  catches: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
});

export interface Match extends Document {
  matchId: string;
  matchNumber: string; // added
  matchType: string; // e.g., 'group', 'semi-final', 'final'
  matchDate: string; // Date of the match
  matchTime: string; // Time of the match (e.g., "15:00")
  location: string; // Venue of the match
  tournamentId: string;
  firstTeamId: string;
  secondTeamId: string;
  firstTeamScore: number;
  secondTeamScore: number;
  firstTeamWickets: number;
  secondTeamWickets: number;
  firstTeamPlayers: Player[];
  secondTeamPlayers: Player[];
  status: string; // e.g., 'upcoming', 'ongoing', 'completed'
  winner: string; // Team ID of the winner
}

const matchSchema: Schema = new Schema({
  matchId: { type: String, required: true },
  matchNumber: { type: String, required: true },
  matchType: { type: String, required: true, enum: ['group', 'semi-final', 'final','knockout'] },
  matchDate: { type: String, required: true }, // Date field for match date
  matchTime: { type: String, required: true }, // Time field for match time
  location: { type: String, required: true }, // Location field for the match venue
  tournamentId: { type: String, required: true },
  firstTeamId: { type: String, required: true },
  secondTeamId: { type: String, required: true },
  firstTeamScore: { type: Number, default: 0 },
  secondTeamScore: { type: Number, default: 0 },
  firstTeamWickets: { type: Number, default: 0 },
  secondTeamWickets: { type: Number, default: 0 },
  firstTeamPlayers: { type: [Schema.Types.Mixed], default: [] },
  secondTeamPlayers: { type: [Schema.Types.Mixed], default: [] },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  winner: { type: String, default: null },
});

export default mongoose.model<Match>('Match', matchSchema);
