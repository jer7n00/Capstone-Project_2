// models/RegisteredPlayer.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRegisteredPlayer extends Document {
    playerId: string;
    teamId: string;
}

const RegisteredPlayerSchema: Schema = new Schema({
    playerId: { type: String, required: true },
    teamId: { type: String, required: true }
});

// playerid and teamid  |accept|  |reject|
export default mongoose.model<IRegisteredPlayer>('RegisteredPlayer', RegisteredPlayerSchema);
