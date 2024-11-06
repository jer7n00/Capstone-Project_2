// src/components/PlayerStatistics.tsx
import React from 'react';
import '../../styles/PlayerStatistics.css';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Summary data remains unchanged
const battingSummary = {
  matches: 50,
  runs: 1500,
  average: 45.2,
  strikeRate: 90.5,
  highestScore: 120,
};

const bowlingSummary = {
  matches: 50,
  wickets: 70,
  bowlingAverage: 24.3,
  economyRate: 4.8,
  bestFigures: '5/30',
};

const fieldingSummary = {
  matches: 50,
  catches: 25,
  runOuts: 10,
  stumpings: 5,
};

const performanceData = [
  { match: 'Match 1', runs: 30, wickets: 2, catches: 1 },
  { match: 'Match 2', runs: 45, wickets: 1, catches: 0 },
  { match: 'Match 3', runs: 70, wickets: 3, catches: 2 },
  { match: 'Match 4', runs: 20, wickets: 0, catches: 1 },
  { match: 'Match 5', runs: 60, wickets: 1, catches: 0 },
];

// Updated matchResultsData structure
const matchResultsData = [
  { name: 'Results', wins: 35, losses: 15 },
];

const PlayerStatistics: React.FC = () => (
  <div className="statistics-section">
    <h2>Your Statistics</h2>
    
    <div className="cards-container">
      {/* Batting Summary */}
      <div className="stat-card">
        <h3>Batting Statistics</h3>
        <p>Matches Played: {battingSummary.matches}</p>
        <p>Total Runs: {battingSummary.runs}</p>
        <p>Batting Average: {battingSummary.average}</p>
        <p>Strike Rate: {battingSummary.strikeRate}</p>
        <p>Highest Score: {battingSummary.highestScore}</p>

        <h4>Performance Graph</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="match" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="runs" fill="#8884d8" name="Runs" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bowling Summary */}
      <div className="stat-card">
        <h3>Bowling Statistics</h3>
        <p>Matches Played: {bowlingSummary.matches}</p>
        <p>Wickets Taken: {bowlingSummary.wickets}</p>
        <p>Bowling Average: {bowlingSummary.bowlingAverage}</p>
        <p>Economy Rate: {bowlingSummary.economyRate}</p>
        <p>Best Figures: {bowlingSummary.bestFigures}</p>

        <h4>Performance Graph</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="match" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="wickets" stroke="#82ca9d" name="Wickets" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fielding Summary */}
      <div className="stat-card">
        <h3>Fielding Statistics</h3>
        <p>Matches Played: {fieldingSummary.matches}</p>
        <p>Catches Taken: {fieldingSummary.catches}</p>
        <p>Run Outs: {fieldingSummary.runOuts}</p>
        <p>Stumpings: {fieldingSummary.stumpings}</p>

        <h4>Performance Graph</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="match" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="catches" fill="#ffc658" name="Catches" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Match Results Summary */}
      <div className="stat-card">
        <h3>Match Results</h3>
        <p>Total Wins: {matchResultsData[0].wins}</p>
        <p>Total Losses: {matchResultsData[0].losses}</p>
        <h4>Performance Graph</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={matchResultsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="wins" fill="#4caf50" name="Wins" barSize={30} />
            <Bar dataKey="losses" fill="#f44336" name="Losses" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      
      </div>
    </div>
  </div>
);

export default PlayerStatistics;
