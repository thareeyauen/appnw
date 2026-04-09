import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="admin-page" onClick={() => showMenu && setShowMenu(false)}>
      <div className="admin-header">
        <div className="admin-header-left">
          <button className="back-button" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="admin-header-title">Admin</h1>
        </div>

        <div className="admin-profile-wrapper" onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
          <span className="admin-profile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          {showMenu && (
            <div className="admin-profile-dropdown">
              <div className="admin-dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span>
                <span className="admin-arrow">›</span>
              </div>
              <div className="admin-dropdown-item" onClick={() => navigate('/feedback')}>
                <span>Feedback</span>
                <span className="admin-arrow">›</span>
              </div>
              <div className="admin-dropdown-item admin-logout" onClick={() => navigate('/Login')}>
                <span>Log out</span>
                <span className="admin-arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-section">
          <h2 className="admin-section-title">Member</h2>
          <button className="admin-menu-button" onClick={() => navigate('/manage-members')}>
            Manage member list
          </button>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">User</h2>
          <button className="admin-menu-button" onClick={() => navigate('/manage-users')}>
            Manage user list
          </button>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Data</h2>
          <button className="admin-menu-button" onClick={() => navigate('/data-management')}>
            Data Management
          </button>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Requirements</h2>
          <button className="admin-menu-button" onClick={() => navigate('/requirements')}>
            Requirements
          </button>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Feedback</h2>
          <button className="admin-menu-button" onClick={() => navigate('/feedback-admin')}>
            Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
