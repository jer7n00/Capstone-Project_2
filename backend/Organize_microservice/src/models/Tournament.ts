import mongoose, { Schema, Document } from 'mongoose';

export interface Tournament extends Document {
  user_id:string,
  tournamentId: string;
  tournamentName: string;
  startDate: Date;
  endDate: Date;
  noOfOvers: number;
  registrationDeadline: Date;
  rulesAndRegulations: string;
  organizerName: string;
  venue: string;
  winnerTeam: string;
  noOfTeams:number;
  status: string; // status:completed, upcoming, ongoing
  teams: string[]; // List of team IDs     //status:completed, upcoming , ongoing
}

const tournamentSchema: Schema = new Schema({
  user_id:{type:String},
  tournamentId: { type: String, required: true },
  tournamentName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  noOfOvers: { type: Number, required: true },
  registrationDeadline: { type: Date, required: true },
  rulesAndRegulations: { type: String, required: true },
  organizerName: { type: String, required: true },
  venue: { type: String, required: true },
  winnerTeam: { type: String, default: null },
  teams: [{ type: String }],
});

export default mongoose.model<Tournament>('Tournament', tournamentSchema);
