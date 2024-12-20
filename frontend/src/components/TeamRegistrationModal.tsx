// src/components/Modal.tsx
import React from 'react';
import '../styles/TeamArea.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teamDetails: any; // Adjust type according to your data structure
 // Adjust type according to your data structure
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, teamDetails}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Registration</h2>
        <h3>Team Details:</h3>
        <p>Team Name: {teamDetails.teamName}</p>
        <p>Team ID: {teamDetails.teamId}</p>
       
       
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
