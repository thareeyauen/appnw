import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Datamanagement.css';

const menuItems = [
  { label: 'Add Expertise', path: '/add-expertise' },
  { label: 'Type of users', path: '/type-of-users' },
];

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const Datamanagement = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="dm-page" onClick={() => showMenu && setShowMenu(false)}>
      <div className="dm-header">
        <div className="dm-header-left">
          <button className="dm-back-btn" onClick={() => navigate('/admin')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="dm-title">Data Management</h1>
        </div>

        <div className="dm-profile-wrapper" onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
          <span className="dm-profile-icon"><ProfileIcon /></span>
          {showMenu && (
            <div className="dm-profile-dropdown">
              <div className="dm-dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span>
                <span className="dm-arrow">›</span>
              </div>
              <div className="dm-dropdown-item dm-logout" onClick={() => navigate('/Login')}>
                <span>Log out</span>
                <span className="dm-arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dm-content">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="dm-menu-btn"
            onClick={() => item.path && navigate(item.path)}
          >
            <span className="dm-plus">+</span>
            <span className="dm-menu-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Datamanagement;
