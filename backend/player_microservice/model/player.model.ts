import { Schema, model, Document } from 'mongoose';

// // Define the PlayerInterface
// export interface PlayerInterface {
//     _id?: string; // Optional ID field
//     player_id: string;
//     user_id: string;
//     name: string; // Player's name
//     age: number; // Player's age
//     role: 'Batter' | 'Bowler' | 'All-Rounder'; // Player's role
//     profilePic?: string; // Optional profile picture
//     battingStats?: { // Optional batting statistics
//         runs?: number; // Total runs
//         matchesPlayed?: number; // Matches played
//     };
//     bowlingStats?: { // Optional bowling statistics
//         wickets?: number; // Total wickets
//         matchesPlayed?: number; // Matches played
//     };
//     teamId?: string; // Team ID as a normal string
// }

// // Define the Mongoose schema
// const playerSchema = new Schema<PlayerInterface & Document>({
//     player_id: { type: String, required: true, unique: true },
//     user_id:{ type: String, required: true, unique: true},
//     name: { type: String, required: true }, // Required name
//     age: { type: Number, required: true }, // Required age
//     role: { type: String, enum: ['Batter', 'Bowler', 'All-Rounder'], required: true }, // Required role
//     profilePic: String, // Optional profile picture
//     battingStats: { // Optional batting statistics
//         runs: Number,
//         matchesPlayed: Number,
//     },
//     bowlingStats: { // Optional bowling statistics
//         wickets: Number,
//         matchesPlayed: Number,
//     },
//     teamId: { type: String }, // Team ID as a string
// }, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// // Export the model
// const Player = model<PlayerInterface & Document>('Player', playerSchema);
// export default Player;
export interface PlayerInterface {
    _id?: string; // Optional ID field
    player_id: string;
    user_id: string;
    name: string; // Player's name
    age: number; // Player's age
    role: 'Batter' | 'Bowler' | 'All-Rounder'; // Player's role
    profilePic?: string; // Optional profile picture
    battingStats?: { // Optional batting statistics
        runs?: number; // Total runs
        matchesPlayed?: number; // Matches played
        fours?: number; // Total fours
        sixes?: number; // Total sixes
        strikeRate?: number; // Strike rate
    };
    bowlingStats?: { // Optional bowling statistics
        wickets?: number; // Total wickets
        matchesPlayed?: number; // Matches played
        catches?: number; // Total catches
    };
    teamId?: string; // Team ID as a normal string
}

// Define the Mongoose schema
const playerSchema = new Schema<PlayerInterface & Document>({
    player_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // Required name
    age: { type: Number, required: true }, // Required age
    role: { type: String, enum: ['Batter', 'Bowler', 'All-Rounder'], required: true }, // Required role
    profilePic: String, // Optional profile picture
    battingStats: { // Optional batting statistics
        runs: { type: Number, default: 0 }, // Default to 0 if not provided
        matchesPlayed: { type: Number, default: 0 }, // Default to 0 if not provided
        fours: { type: Number, default: 0 }, // Default to 0 if not provided
        sixes: { type: Number, default: 0 }, // Default to 0 if not provided
        strikeRate: { type: Number, default: 0 }, // Default to 0 if not provided
    },
    bowlingStats: { // Optional bowling statistics
        wickets: { type: Number, default: 0 }, // Default to 0 if not provided
        matchesPlayed: { type: Number, default: 0 }, // Default to 0 if not provided
        catches: { type: Number, default: 0 }, // Default to 0 if not provided
    },
    teamId: { type: String }, // Team ID as a string
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the model
const Player = model<PlayerInterface & Document>('Player', playerSchema);
export default Player;