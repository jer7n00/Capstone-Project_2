// src/types/types.ts

export interface Player {
    player_id: string;      // Unique identifier for the player
    user_id: string;        // User ID associated with the player
    name: string;           // Player's name
    age: number;           // Player's age
    role: 'Batter' | 'Bowler' | 'All-Rounder'; // Player's role
    profilePic?: string;    // Optional profile picture URL
    battingStats?: {
        runs?: number;       // Total runs scored
        matchesPlayed?: number; // Matches played
    };
    bowlingStats?: {
        wickets?: number;     // Total wickets taken
        matchesPlayed?: number; // Matches played
    };
    teamId?: string;        // ID of the team the player belongs to
}

export interface Team {
    team_id: string;        // Unique identifier for the team
    name: string;           // Name of the team
    players: string[];      // List of player IDs in the team
}

export interface Match {
    match_id: string;       // Unique identifier for the match
    date: Date;             // Match date
    teamA: string;          // ID of Team A
    teamB: string;          // ID of Team B
    result?: string;        // Result of the match (e.g., Win, Loss)
    score?: {
        teamA: number;      // Score of Team A
        teamB: number;      // Score of Team B
    };
}

export interface Tournament {
    tournament_id: string;  // Unique identifier for the tournament
    name: string;           // Name of the tournament
    teams: string[];        // List of team IDs participating in the tournament
    startDate: Date;        // Start date of the tournament
    endDate: Date;          // End date of the tournament
    matches: string[];      // List of match IDs in the tournament
}

// Define JWT Payload Interface
export interface JwtPayload {
    id: string;             // User ID
    role: string;           // User role (e.g., Player, Organizer, Manager)
}
