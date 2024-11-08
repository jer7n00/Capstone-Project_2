import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../../styles/organizer/CreateTeam.css';

const CreateTeam: React.FC = () => {
  const [teamData, setTeamData] = useState({
    teamId: '',
    teamName: '',
    teamLogoUrl: '', // New field for the logo URL
  });

  const [logoFile, setLogoFile] = useState<File | null>(null); // File state for the logo
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id'); // Retrieve user_id from local storage
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setLogoFile(file); // Set the selected file
      console.log("File selected:", file); // Log the file for debugging
    } else {
      console.log("No file selected"); // Log if no file is selected
    }
  };

  const uploadLogoToCloudinary = async () => {
    if (!logoFile) {
      console.error("No file selected for upload");
      return '';
    }

    const formData = new FormData();
    formData.append('file', logoFile);
    formData.append('upload_preset', 'my_upload_preset'); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dmvrmgegr/image/upload', // Replace with your Cloudinary URL
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const logoUrl = await uploadLogoToCloudinary();
      const finalTeamData = { ...teamData, teamLogoUrl: logoUrl, userId }; // Add userId to the team data
      console.log(finalTeamData);

      const response = await axios.post('http://localhost:7000/api/teams/api/teams', finalTeamData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessage('Team created successfully!');
      setTeamData({ teamId: '', teamName: '', teamLogoUrl: '' });
      setLogoFile(null);

      // Clear the file input by setting its value to an empty string
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setMessage('Failed to create team. Please try again.');
    }
  };

  return (
    <div className="create-team-container">
      <h2>Create Team</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamId">Team ID</label>
          <input
            type="text"
            name="teamId"
            value={teamData.teamId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="teamName">Team Name</label>
          <input
            type="text"
            name="teamName"
            value={teamData.teamName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="teamLogo">Team Logo</label>
          <input
            type="file"
            name="teamLogo"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef} // Attach the ref to the file input
          />
        </div>

        <button type="submit" className="submit-button">
          Create Team
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
