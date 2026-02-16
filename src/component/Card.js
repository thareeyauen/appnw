import React from 'react';
import './Card.css';

const Card = ({ 
  name = "XXXXXXXXXXXXXXXXXXX",        // ✅ เปลี่ยนจาก title เป็น name
  name_th = "XXXXXXXXXXXXXXXXXXX",     // ✅ เปลี่ยนจาก subtitle เป็น name_th
  project = "XXXXXXXXXXXXXXXXXXX",     // ✅ เปลี่ยนจาก subtitle เป็น project
  location = "XXXXXXXXXXXXXXXXXXX",    // ✅ เปลี่ยนจาก infoLine2 เป็น location
  tags = [],                           // ✅ เปลี่ยนเป็น array ของ objects
  email = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  // ✅ เปลี่ยนจาก footer เป็น email
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="currentColor"/>
            <path d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="card-title-section">
          <h3 className="card-title">{name}</h3>
          <p className="card-subtitle">{name_th}</p>
        </div>
      </div>

      <div className="card-body">
        <div className="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{project}</span>
        </div>
        
        <div className="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{location}</span>
        </div>
      </div>

      <div className="card-tags">
        {tags.map((tag, index) => (
          <button key={index} className={`tag-button ${tag.label}`}>
            {tag.label}
          </button>
        ))}
      </div>

      <div className="card-footer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 3V9" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <span>{email}</span>
      </div>
    </div>
  );
};

export default Card;