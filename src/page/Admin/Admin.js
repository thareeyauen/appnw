import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';


const Admin = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="admin-header-title">Admin</h1>
      </div>

      <div className="admin-content">
        <div className="admin-section">
          <h2 className="admin-section-title">Requirements</h2>
          <button className="admin-menu-button" onClick={() => navigate('/requirements')}>
            Requirements
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
