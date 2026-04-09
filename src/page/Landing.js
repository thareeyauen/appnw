import { API_URL } from '../config';
import Card from '../component/Card';
import './Landing.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { clearAuth, isAdmin } from '../utils/auth';

function Landing() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expertiseDescMap, setExpertiseDescMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/people`)
      .then(response => response.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/expertise`)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const map = {};
        data.forEach(e => { map[e.label] = e.description || ''; });
        setExpertiseDescMap(map);
      })
      .catch(() => {});
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filteredContacts = q
    ? contacts.filter(c => {
        const tagLabels = (c.tags || []).map(t => (t.label || '').toLowerCase()).join(' ');
        return (
          (c.name || '').toLowerCase().includes(q) ||
          (c.name_th || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          (c.location || '').toLowerCase().includes(q) ||
          (c.project || '').toLowerCase().includes(q) ||
          tagLabels.includes(q)
        );
      })
    : contacts;

  return (
    <div className="landing-container">
      <div className="top-bar">
        <button className="add-member" onClick={() => navigate('/addmember')}>+ Add New member</button>
        <div className="profile-wrapper" onClick={() => setShowMenu(!showMenu)}>
          <span className="profile-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg></span>
          {showMenu && (
            <div className="profile-dropdown">
              {isAdmin() && (
                <div className="dropdown-item" onClick={() => navigate('/admin')}>
                  <span>Admin</span>
                  <span className="arrow">›</span>
                </div>
              )}
              <div className="dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span>
                <span className="arrow">›</span>
              </div>
              <div className="dropdown-item" onClick={() => navigate('/feedback')}>
                <span>Feedback</span>
                <span className="arrow">›</span>
              </div>
              <div className="dropdown-item logout" onClick={() => { clearAuth(); navigate('/Login'); }}>
                <span>Log out</span>
                <span className="arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="content">
        <h1>Network</h1>
        <h2>Contact list</h2>

        <div className="search-box">
          <input
            placeholder="Searching"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading contacts...</p>
        ) : (
          <p className="people-count">{filteredContacts.length} people</p>
        )}

<div className="card-list">
  {filteredContacts.map(contact => (
    <Card
      key={contact.id}
      id={contact.id}
      name={contact.name}
      name_th={contact.name_th}
      project={contact.project}
      location={contact.location}
      tags={contact.tags}
      email={contact.email}
      avatar={contact.avatar ? `${API_URL}${contact.avatar}` : null}
      expertiseDescMap={expertiseDescMap}
    />
  ))}
</div>
      </div>
    </div>
  );
}

export default Landing;