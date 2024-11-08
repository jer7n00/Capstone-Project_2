import React from 'react';

const Features: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Features</h1>
      <ul style={styles.list}>
        <li style={styles.listItem}>Create and manage tournaments easily</li>
        <li style={styles.listItem}>Register players and manage their profiles</li>
        <li style={styles.listItem}>Track player stats and performance</li>
        <li style={styles.listItem}>View and update match scores in real-time</li>
        <li style={styles.listItem}>Get detailed tournament insights and analytics</li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    color: '#2e3b4e',
    marginBottom: '1rem',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    fontSize: '1.2rem',
    color: '#555555',
    marginBottom: '1rem',
  },
};

export default Features;
