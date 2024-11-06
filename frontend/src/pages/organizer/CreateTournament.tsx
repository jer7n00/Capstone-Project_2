import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/organizer/CreateTournament.css';

const CreateTournament: React.FC = () => {
  const [tournamentData, setTournamentData] = useState({
    tournamentId: '',
    tournamentName: '',
    startDate: '',
    endDate: '',
    noOfOvers: '',
    registrationDeadline: '',
    rulesAndRegulations: '',
    organizerName: '',
    venue: '',
  });
  
  const [teams, setTeams] = useState<{ id: string; name: string; seriesId: string }[]>([]); // Include seriesId in team structure
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ id: '', name: '' }); // Store new team data

  const token = localStorage.getItem('token'); // Retrieve token from local storage
  const user_id = localStorage.getItem('user_id'); // Retrieve user_id from local storage

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTournamentData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeam(prevState => ({ ...prevState, [name]: value }));
  };

  const addTeam = () => {
    if (newTeam.id && newTeam.name) {
      const seriesId = tournamentData.tournamentId; // Get the current tournament ID
      setTeams(prevTeams => [
        ...prevTeams,
        { id: newTeam.id, name: newTeam.name, seriesId } // Include seriesId in team data
      ]);
      setNewTeam({ id: '', name: '' }); // Reset new team input
      setShowModal(false); // Close the modal
    } else {
      alert("Please fill in both Team ID and Team Name");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create tournament
      const response = await axios.post(
        'http://localhost:7000/api/tournaments/api/tournaments',
        {
          ...tournamentData,
          user_id, // Add user_id to request body
          teams: teams.map(team => team.id), // Only include team IDs in tournament data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      alert('Tournament created successfully!');
  
      // Add teams to the database
      for (const team of teams) {
        await axios.post(
          'http://localhost:7000/api/teams/api/teams', 
          { teamId: team.id, teamName: team.name, seriesId: team.seriesId }, // Include all team details
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
  
      // Reset tournament data and teams after successful creation
      setTournamentData({
        tournamentId: '',
        tournamentName: '',
        startDate: '',
        endDate: '',
        noOfOvers: '',
        registrationDeadline: '',
        rulesAndRegulations: '',
        organizerName: '',
        venue: '',
      });
      setTeams([]);
    } catch (error) {
      alert('Failed to create tournament. Please try again.');
    }
  };

  return (
    <div className="create-tournament-container">
      <h2>Create Tournament</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields remain unchanged */}
        <div className="form-group">
          <label htmlFor="tournamentId">Tournament ID</label>
          <input
            type="text"
            name="tournamentId"
            value={tournamentData.tournamentId}
            onChange={handleChange}
            placeholder="Unique tournament ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tournamentName">Tournament Name</label>
          <input
            type="text"
            name="tournamentName"
            value={tournamentData.tournamentName}
            onChange={handleChange}
            placeholder="Tournament name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={tournamentData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            name="endDate"
            value={tournamentData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="noOfOvers">Number of Overs</label>
          <input
            type="number"
            name="noOfOvers"
            value={tournamentData.noOfOvers}
            onChange={handleChange}
            placeholder="Number of overs per match"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="registrationDeadline">Registration Deadline</label>
          <input
            type="date"
            name="registrationDeadline"
            value={tournamentData.registrationDeadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rulesAndRegulations">Rules and Regulations</label>
          <textarea
            name="rulesAndRegulations"
            value={tournamentData.rulesAndRegulations}
            onChange={handleChange}
            placeholder="Enter the rules and regulations"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="organizerName">Organizer Name</label>
          <input
            type="text"
            name="organizerName"
            value={tournamentData.organizerName}
            onChange={handleChange}
            placeholder="Organizer name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue</label>
          <input
            type="text"
            name="venue"
            value={tournamentData.venue}
            onChange={handleChange}
            placeholder="Tournament venue"
            required
          />
        </div>

        <div className="form-group">
          <label>Teams</label>
          <ul className="team-list">
            {teams.map((team, index) => (
              <li key={index}>{team.name} (ID: {team.id}, Series ID: {team.seriesId})</li>
            ))}
          </ul>
          <button type="button" className="add-team-button" onClick={() => setShowModal(true)}>
            Add Team
          </button>
        </div>

        <button type="submit" className="submit-button">
          Create Tournament
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Team</h3>
            <div className="form-group">
              <label htmlFor="teamId">Team ID</label>
              <input
                type="text"
                name="id"
                value={newTeam.id}
                onChange={handleTeamChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="teamName">Team Name</label>
              <input
                type="text"
                name="name"
                value={newTeam.name}
                onChange={handleTeamChange}
                required
              />
            </div>
            <div className="modal-buttons">
              <button className="add-team-submit-button" onClick={addTeam}>
                Add Team
              </button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTournament;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../../styles/organizer/CreateTournament.css';

// const CreateTournament: React.FC = () => {
//   const [tournamentData, setTournamentData] = useState({
//     tournamentId: '',
//     tournamentName: '',
//     startDate: '',
//     endDate: '',
//     noOfOvers: '',
//     registrationDeadline: '',
//     rulesAndRegulations: '',
//     organizerName: '',
//     venue: '',
//   });

//   const [availableTeams, setAvailableTeams] = useState<{ id: string; name: string }[]>([]);
//   const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]); // Store selected team IDs
//   const token = localStorage.getItem('token'); // Retrieve token from local storage
//   const user_id = localStorage.getItem('user_id'); // Retrieve user_id from local storage

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const response = await axios.get('http://localhost:7000/api/teams/api/teams', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAvailableTeams(response.data); // Assuming response.data is an array of teams
//       } catch (error) {
//         console.error('Failed to fetch teams', error);
//       }
//     };

//     fetchTeams();
//   }, [token]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setTournamentData(prevState => ({ ...prevState, [name]: value }));
//   };

//   const handleTeamSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     setSelectedTeamIds(prevIds => 
//       checked ? [...prevIds, value] : prevIds.filter(id => id !== value)
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // Create tournament
//       const response = await axios.post(
//         'http://localhost:7000/api/tournaments/api/tournaments',
//         {
//           ...tournamentData,
//           user_id, // Add user_id to request body
//           teams: selectedTeamIds, // Use selected team IDs
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert('Tournament created successfully!');

//       // Reset tournament data and selected teams after successful creation
//       setTournamentData({
//         tournamentId: '',
//         tournamentName: '',
//         startDate: '',
//         endDate: '',
//         noOfOvers: '',
//         registrationDeadline: '',
//         rulesAndRegulations: '',
//         organizerName: '',
//         venue: '',
//       });
//       setSelectedTeamIds([]); // Reset selected team IDs
//     } catch (error) {
//       alert('Failed to create tournament. Please try again.');
//     }
//   };

//   return (
//     <div className="create-tournament-container">
//       <h2>Create Tournament</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Form fields remain unchanged */}
//         <div className="form-group">
//           <label htmlFor="tournamentId">Tournament ID</label>
//           <input
//             type="text"
//             name="tournamentId"
//             value={tournamentData.tournamentId}
//             onChange={handleChange}
//             placeholder="Unique tournament ID"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="tournamentName">Tournament Name</label>
//           <input
//             type="text"
//             name="tournamentName"
//             value={tournamentData.tournamentName}
//             onChange={handleChange}
//             placeholder="Tournament name"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="startDate">Start Date</label>
//           <input
//             type="date"
//             name="startDate"
//             value={tournamentData.startDate}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="endDate">End Date</label>
//           <input
//             type="date"
//             name="endDate"
//             value={tournamentData.endDate}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="noOfOvers">Number of Overs</label>
//           <input
//             type="number"
//             name="noOfOvers"
//             value={tournamentData.noOfOvers}
//             onChange={handleChange}
//             placeholder="Number of overs per match"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="registrationDeadline">Registration Deadline</label>
//           <input
//             type="date"
//             name="registrationDeadline"
//             value={tournamentData.registrationDeadline}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="rulesAndRegulations">Rules and Regulations</label>
//           <textarea
//             name="rulesAndRegulations"
//             value={tournamentData.rulesAndRegulations}
//             onChange={handleChange}
//             placeholder="Enter the rules and regulations"
//             required
//           ></textarea>
//         </div>

//         <div className="form-group">
//           <label htmlFor="organizerName">Organizer Name</label>
//           <input
//             type="text"
//             name="organizerName"
//             value={tournamentData.organizerName}
//             onChange={handleChange}
//             placeholder="Organizer name"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="venue">Venue</label>
//           <input
//             type="text"
//             name="venue"
//             value={tournamentData.venue}
//             onChange={handleChange}
//             placeholder="Tournament venue"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Available Teams</label>
//           <ul className="team-list">
//             {availableTeams.map((team) => (
//               <li key={team.id}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={team.id}
//                     checked={selectedTeamIds.includes(team.id)}
//                     onChange={handleTeamSelect}
//                   />
//                   {team.name} (ID: {team.id})
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <button type="submit" className="submit-button">
//           Create Tournament
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateTournament;

