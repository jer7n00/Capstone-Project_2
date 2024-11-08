import React from 'react';

const About: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>About Us</h1>
      <p style={styles.paragraph}>
        Welcome to Cricket Tournament, an application designed to simplify the management of cricket tournaments. 
        Organizers can create and manage tournaments, players can register, view stats, and participate in matches. 
        Our goal is to provide a seamless and engaging platform for cricket lovers.
      </p>
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
  paragraph: {
    fontSize: '1.2rem',
    color: '#555555',
    lineHeight: '1.6',
  },
};

export default About;
