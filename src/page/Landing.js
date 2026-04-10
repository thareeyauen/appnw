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

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  const q = searchQuery.trim().toLowerCase();
  const filteredContacts = q
    ? contacts.filter(c => {
        const tagLabels = (c.tags || []).map(t => (t.label || '').toLowerCase()).join(' ');
        return (
          (c.name || '').toLowerCase().includes(q) ||
          (c.name_th || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          (c.national || '').toLowerCase().includes(q) ||
          (c.project || '').toLowerCase().includes(q) ||
          tagLabels.includes(q)
        );
      })
    : contacts;

  const totalPages = Math.ceil(filteredContacts.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const pageContacts = filteredContacts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (val) => { setSearchQuery(val); setCurrentPage(1); };

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
            onChange={e => handleSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading contacts...</p>
        ) : (
          <p className="people-count">{filteredContacts.length} people</p>
        )}

        <div className="card-list">
          {pageContacts.map(contact => (
            <Card
              key={contact.id}
              id={contact.id}
              name={contact.name}
              name_th={contact.name_th}
              project={contact.project}
              location={contact.country}
              tags={contact.tags}
              email={contact.email}
              avatar={contact.avatar ? (contact.avatar.startsWith('http') ? contact.avatar : `${API_URL}${contact.avatar}`) : null}
              expertiseDescMap={expertiseDescMap}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`pagination-btn${safePage === p ? ' pagination-btn--active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >{p}</button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >›</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Landing;