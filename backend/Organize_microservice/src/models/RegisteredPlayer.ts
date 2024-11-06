// // models/RegisteredPlayer.ts
// import mongoose, { Schema, Document } from 'mongoose';

// // RegisteredPlayer table information
// export interface RegisteredPlayerDocument extends Document {
//   playerId: string;
//   playerName: string;
//   role: string;
//   teamId: string; 
// }


// const RegisteredPlayerSchema: Schema = new Schema({
//   playerId: { type: String, required: true },
//   // playerName: { type: String, required: true },
//   // age: { type: Number, required: true },
//   // role: { type: String, required: true },
//   teamId: { type: String, required: true },
// });


// export default mongoose.model<RegisteredPlayerDocument>('RegisteredPlayer', RegisteredPlayerSchema);
