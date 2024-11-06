import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Divider, List, ListItem, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

// Custom styles using makeStyles
const useStyles = makeStyles({
  root: {
    padding: '1.5rem',
    fontFamily: '"Lato", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
  },
  card: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '0px',
    padding: '1rem',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.01)',
    },
  },
  welcomeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    color: '#00529B',
    padding: '1.5rem',
    borderRadius: '0px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#2e3b4e',
  },
  sectionTitle: {
    fontFamily: '"Lato", sans-serif',
    fontWeight: 500,
    fontSize: '1.2rem',
    color: '#2e3b4e',
    marginBottom: '0.5rem',
  },
  divider: {
    margin: '0.5rem 0',
    backgroundColor: '#e0e0e0',
  },
  listText: {
    color: '#37474f',
    fontSize: '0.9rem',
    fontFamily: '"Lato", "Segoe UI", sans-serif',
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#ffc107',
    fontSize: '1.6rem',
    marginBottom: '0.8rem',
  },
});

const PlayerHome: React.FC = () => {
  const classes = useStyles();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>(''); 
  const [stats, setStats] = useState({ totalMatches: 0, wins: 0, losses: 0 });
  const [previousMatches, setPreviousMatches] = useState<any[]>([]); 
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]); 
  const [teamDetails, setTeamDetails] = useState({ teamName: '', role: '' });

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        // Fetch player ID from user ID
        const playerResponse = await axios.get(`http://localhost:8000/user_id/${userId}`);
        const fetchedPlayerId = playerResponse.data.player_id;
        setPlayerId(fetchedPlayerId);

        // Fetch player details
        const playerDetailsResponse = await axios.get(`http://localhost:8000/player_id/${fetchedPlayerId}`);
        const playerData = playerDetailsResponse.data;
        setPlayerName(playerData.name);

        // Fetch stats
        const statsResponse = await axios.get(`http://localhost:8000/player/${fetchedPlayerId}/stats`);
        setStats({
          totalMatches: statsResponse.data.totalMatches,
          wins: statsResponse.data.wins,
          losses: statsResponse.data.losses,
        });

        // Fetch previous matches
        const previousMatchesResponse = await axios.get(`http://localhost:4000/api/matches/completed-matches/${fetchedPlayerId}`);
        setPreviousMatches(previousMatchesResponse.data || []); // Ensure it's always an array

        // Fetch upcoming matches
        const upcomingMatchesResponse = await axios.get(`http://localhost:4000/api/matches/upcoming-matches/${fetchedPlayerId}`);
        if (upcomingMatchesResponse.data?.upcomingMatches?.length > 0) {
          setUpcomingMatches(upcomingMatchesResponse.data.upcomingMatches);
        } else {
          setUpcomingMatches([]);
        }

        // Fetch team details if team ID is present
        if (playerData.teamId) {
          const teamResponse = await axios.get(`http://localhost:5000/api/teams/${playerData.teamId}`);
          const teamData = teamResponse.data;
          setTeamDetails({
            teamName: teamData.teamName,
            role: playerData.role,
          });
        } else {
          setTeamDetails({
            teamName: 'Not joined a team yet',
            role: playerData.role,
          });
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayerData();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {/* Welcome Card */}
        <Grid item xs={12} md={8}>
          <Card className={`${classes.card} ${classes.welcomeCard}`}>
            <Avatar className={classes.avatar}>P</Avatar>
            <Typography variant="h4" className={classes.title}>
              Welcome Back, {playerName}!
            </Typography>
          </Card>
        </Grid>

        {/* Stats Overview Card */}
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <Typography variant="h5" className={classes.sectionTitle}>
              Stats Overview
            </Typography>
            <Typography variant="body1" className={classes.listText}>Total Matches: {stats.totalMatches}</Typography>
            <Typography variant="body1" className={classes.listText}>Wins: {stats.wins}</Typography>
            <Typography variant="body1" className={classes.listText}>Losses: {stats.losses}</Typography>
          </Card>
        </Grid>

        {/* Previous Matches Card */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" className={classes.sectionTitle}>
                Previous Matches
              </Typography>
              <Divider className={classes.divider} />
              <List>
                {Array.isArray(previousMatches) && previousMatches.length > 0 ? (
                  previousMatches.map((match, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Date: ${match.date}`}
                        secondary={`Score: ${match.score} - Result: ${match.result}`}
                        classes={{ primary: classes.listText, secondary: classes.listText }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" className={classes.listText}>No previous matches found.</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Matches Card */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" className={classes.sectionTitle}>
                Upcoming Matches
              </Typography>
              <Divider className={classes.divider} />
              <List>
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((match, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Date: ${match.matchDate}`}
                        secondary={`Against: ${match.firstTeamId} vs ${match.secondTeamId} - Location: ${match.location} - Time: ${match.matchTime}`}
                        classes={{ primary: classes.listText, secondary: classes.listText }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" className={classes.listText}>No upcoming matches.</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Details Card */}
        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" className={classes.sectionTitle}>
                Team Details
              </Typography>
              <Divider className={classes.divider} />
              <Typography variant="body1" className={classes.listText}>Team Name: {teamDetails.teamName}</Typography>
              <Typography variant="body1" className={classes.listText}>Role: {teamDetails.role}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default PlayerHome;
