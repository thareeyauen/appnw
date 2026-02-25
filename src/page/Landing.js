import Card from '../component/Card';
import './Landing.css';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

function Landing() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/people')
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

  return (
    <div className="landing-container">
      <div className="top-bar">
        <button className="add-member" onClick={() => navigate('/addmember')}>+ Add New member</button>
        <div className="profile-wrapper" onClick={() => setShowMenu(!showMenu)}>
          <span className="profile-icon">👤</span>
          {showMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <span>My Profile</span>
                <span className="arrow">›</span>
              </div>
              <div className="dropdown-item logout" onClick={() => navigate('/Login')}>
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
          <input placeholder="Searching" />
        </div>

        {loading ? (
          <p>Loading contacts...</p>
        ) : (
          <p className="people-count">{contacts.length} people</p>
        )}

<div className="card-list">
  {contacts.map(contact => (
    <Card
      key={contact.id}
      id={contact.id}
      name={contact.name}
      name_th={contact.name_th}
      project={contact.project}
      location={contact.location}
      tags={contact.tags}
      email={contact.email}
      avatar={contact.avatar}
    />
  ))}
</div>
      </div>
    </div>
  );
}

export default Landing;