import mongoose, { Schema, Document } from 'mongoose';

export interface RegisteredTeam extends Document {
  teamId: string;
  tournamentId: string;
}

const registeredTeamSchema: Schema = new Schema({
  teamId: { type: String, required: true },
  tournamentId: { type: String, required: true },
});

export default mongoose.model<RegisteredTeam>('RegisteredTeam', registeredTeamSchema);
