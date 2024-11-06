import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/PlayerProfile.css';
import picCric from '../../assets/cricket-bg8.png';

const PlayerProfile: React.FC = () => {
  const navigate = useNavigate();
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const loggedInName = localStorage.getItem('username');
  const loggedInEmail = localStorage.getItem('email');

  const [name, setName] = useState(loggedInName || '');
  const [email, setEmail] = useState(loggedInEmail || '');
  const [age, setAge] = useState('');
  const [role, setRole] = useState<'Batter' | 'Bowler' | 'All-Rounder'>('Batter');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const playerData = {
      player_id: Math.floor(Math.random() * 1000000),
      user_id,
      name,
      age,
      role,
      profilePic,
    };

    try {
      await axios.post('http://localhost:7000/api/players', playerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await axios.patch(
        `http://localhost:7000/api/auth/get/${user_id}`,
        { profileCompleted: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Profile updated successfully!');
      navigate('/player-dashboard'); // Navigate to player dashboard upon success
    } catch (error) {
      console.error('Error saving player profile:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Update Profile</h2>
      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            required
            className="form-input"
            readOnly
          />
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            required
            className="form-input"
            readOnly
          />
          <label className="form-label">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            required
            className="form-input"
          />
          <label className="form-label">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'Batter' | 'Bowler' | 'All-Rounder')}
            className="form-select"
          >
            <option value="Batter">Batter</option>
            <option value="Bowler">Bowler</option>
            <option value="All-Rounder">All-Rounder</option>
            <option value="Wicket-Keeper">Wicket-Keeper</option>
          </select>
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="form-input"
          />
          <label className="form-label">Profile Picture</label>
          <div className="upload-container">
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-upload" className="upload-button">
              Upload Picture
            </label>
          </div>
          {profilePic && <img src={profilePic} alt="Profile" className="profile-preview" />}
          <button type="submit" className="submit-button">Save Changes</button>
        </form>
        <div className="profile-image">
          <img src={picCric} alt="Profile Preview" className="profile-image-preview" />
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;