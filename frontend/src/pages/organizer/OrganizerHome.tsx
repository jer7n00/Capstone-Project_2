import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const OrganizerHome: React.FC = () => (
  <Card>
    <CardContent>
      <Typography variant="h4">Welcome, Organizer!</Typography>
      <Typography variant="body1">
        Here you can manage tournaments, view participants, and organize events.
      </Typography>
    </CardContent>
  </Card>
);

export default OrganizerHome;
