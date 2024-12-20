// models/Team.ts
import mongoose, { Schema, Document } from 'mongoose';

// interface Player {
//   playerId: string;
//   playerName: string;
//   role: string;
// }

// // Team table information
// export interface TeamDocument extends Document {
//   teamId: string;  // Custom team ID field
//   teamName: string;
//   seriesId: string; 
//   noOfMatches: number;
//   wins: number;
//   losses: number;
//   players: Player[];
// }
export interface TeamDocument extends Document {
  teamId: string;  // Custom team ID field
  teamName: string;
  seriesId: string; 
  noOfMatches: number;
  wins: number;
  losses: number;
  players: string[]; // Now storing only Player IDs as strings
  teamLogoUrl:string;
  userId:string;
}

// Team model definition
const TeamSchema: Schema = new Schema({
  teamId: { type: String, required: true, unique: true },  // Define custom ID with uniqueness constraint
  teamName: { type: String, required: true },
  seriesId: { type: String},
  noOfMatches: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  players: [{ type: String }], // Only store player IDs as strings
  teamLogoUrl: {type:String},
  userId:{type:String}
});

// Set `teamId` as the primary key by disabling `_id`
// TeamSchema.set('id', false);
// TeamSchema.set('_id', false);

export default mongoose.model<TeamDocument>('Team', TeamSchema);
// // models/Team.ts
// import mongoose, { Schema, Document } from 'mongoose';

// interface Player {
//   playerId: string;
//   playerName: string;
//   role: string;
// }

// //Team table information
// export interface TeamDocument extends Document {
//   teamName: string;
//   seriesId: string;
//   noOfMatches: number;
//   wins: number;
//   losses: number;
//   players: Player[];
// }

// // Team model definition
// const TeamSchema: Schema = new Schema({
//   teamName: { type: String, required: true },
//   seriesId: { type: String, required: true },
//   noOfMatches: { type: Number, default: 0 },
//   wins: { type: Number, default: 0 },
//   losses: { type: Number, default: 0 },
//   players: [{ playerId: String, playerName: String, role: String }],
// });

// export default mongoose.model<TeamDocument>('Team', TeamSchema);
