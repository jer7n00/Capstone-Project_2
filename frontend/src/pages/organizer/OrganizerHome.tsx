import React from 'react';
import { Card, CardContent, Typography, Grid, Button, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '2rem',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    marginBottom: '2rem',
    '&:hover': {
      transform: 'scale(1.02)',
      transition: '0.3s',
    },
  },
  header: {
    fontWeight: 700,
    color: '#00529B',
    fontSize: '1.8rem',
    marginBottom: '1rem',
  },
  subheader: {
    color: '#333333',
    fontSize: '1.1rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#2e3b4e',
    marginBottom: '1rem',
  },
  button: {
    backgroundColor: '#00529B',
    color: '#fff',
    padding: '0.8rem 1.6rem',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: '#003f7f',
    },
  },
  divider: {
    margin: '1rem 0',
    backgroundColor: '#e0e0e0',
  },
  gridContainer: {
    marginTop: '2rem',
  },
  cardContent: {
    paddingBottom: '1.5rem',
  },
});

const OrganizerHome: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12} md={8}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h4" className={classes.header}>
                Welcome, Organizer!
              </Typography>
              <Typography variant="body1" className={classes.subheader}>
                Here you can manage tournaments, view participants, create and edit events, and monitor ongoing matches. Stay in control of your tournament from start to finish.
              </Typography>
        
            </CardContent>
          </Card>
        </Grid>

        {/* Manage Tournaments Card */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>Manage Tournaments</Typography>
              <Divider className={classes.divider} />
              <Typography variant="body1">
                Create and organize tournaments, update match schedules, and monitor participant registration. Ensure everything is running smoothly with the tools provided.
              </Typography>
             
            </CardContent>
          </Card>
        </Grid>

        {/* View Participants Card */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>View Participants</Typography>
              <Divider className={classes.divider} />
              <Typography variant="body1">
                View all participants registered for the tournament. Track their progress, roles, and stats to ensure the event runs efficiently.
              </Typography>
           
            </CardContent>
          </Card>
        </Grid>

        {/* Event Management Card */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>Event Management</Typography>
              <Divider className={classes.divider} />
              <Typography variant="body1">
                Set match schedules, update scores, and manage event logistics. Make real-time decisions with ease to provide the best experience for all players and spectators.
              </Typography>
            
            </CardContent>
          </Card>
        </Grid>

        {/* Ongoing Matches Card */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>Ongoing Matches</Typography>
              <Divider className={classes.divider} />
              <Typography variant="body1">
                Keep track of all ongoing matches, update scores, and ensure fair play during live events.
              </Typography>
             
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default OrganizerHome;
