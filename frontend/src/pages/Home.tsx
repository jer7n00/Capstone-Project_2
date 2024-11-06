import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => (
  <div className="home">
    {/* Hero Section */}
    <section className="hero-section">
      <h1>Welcome to the Ultimate Cricket Tournament Platform!</h1>
      <p>Manage teams, track player stats, organize tournaments, and more with ease.</p>
      <Link to="/signup" className="cta-button">Get Started</Link>
    </section>

    {/* Features Section */}
    <section className="features-section">
      <div className="feature-card">
        <h2>Player Stats</h2>
        <p>View and analyze player stats to make informed decisions and improve your game strategy.</p>
      </div>
      <div className="feature-card">
        <h2>Team Management</h2>
        <p>Create and manage teams effectively, with detailed information on players and performance.</p>
      </div>
      <div className="feature-card">
        <h2>Tournament Organization</h2>
        <p>Organize and monitor tournaments effortlessly, from schedules to final results.</p>
      </div>
    </section>

    {/* About Section */}
    <section className="about-section">
      <h2>About Our Platform</h2>
      <p>
        Our platform is designed to revolutionize the cricket experience. With tools for team management,
        player stats tracking, and tournament organization, we empower teams, players, and organizers to excel.
      </p>
    </section>

    {/* Testimonials Section */}
    <section className="testimonials-section">
      <h2>What Our Users Say</h2>
      <div className="testimonial">
        <p>"This platform has made organizing our local tournaments so easy. A real game-changer!"</p>
        <span>- John Doe, Team Captain</span>
      </div>
      <div className="testimonial">
        <p>"I can track my performance stats like never before. It's improved my game significantly."</p>
        <span>- Jane Smith, Player</span>
      </div>
    </section>
  </div>
);

export default Home;
