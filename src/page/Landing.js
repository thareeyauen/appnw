import Card from '../component/Card';
import './Landing.css';
import React from "react";

function Landing() {
  // ใส่ข้อมูลตรงนี้
  const contacts = [
    {
      id: 1,
      name: 'Khairil Yusof',
      name_th: 'ไคลิว ยูซอฟ',
      project: 'Sinar Project',
      location: 'Malaysia',
      tags: [
        { label: 'Open Data'},
        { label: 'Procurement'},
        { label: 'PEPS'}

      ],
      email: 'Khairil@gmail.com'
    },
    {
      id: 2,
      name: 'JAME CORSTIS',
      name_th: 'เจม คอร์ทิส',
      project: 'Cortis',
      location: 'Taiwan',
      tags: [
        { label: 'Open Data', type: 'primary' },
        { label: 'Procurement', type: 'secondary' }
      ],
      email: 'Khairil@gmail.com'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      name_th: 'ซาร่า จอห์นสัน',
      project: 'Tech Innovation',
      location: 'Singapore',
      tags: [
        { label: 'Open Data', type: 'primary' },
        { label: 'Procurement', type: 'secondary' }
      ],
      email: 'sarah@gmail.com'
    },
        {
      id: 4,
      name: 'Michael Chen',
      name_th: 'ไมเคิล เฉิน',
      project: 'Digital Transformation',
      location: 'Thailand',
      tags: [
        { label: 'Open Data', type: 'primary' },
        { label: 'Procurement', type: 'secondary' }
      ],
      email: 'michael@gmail.com'
    },

      {
      id: 5,
      name: 'Sarah Johnson',
      name_th: 'ซาร่า จอห์นสัน',
      project: 'Tech Innovation',
      location: 'Singapore',
      tags: [
        { label: 'Open Data', type: 'primary' },
        { label: 'Procurement', type: 'secondary' }
      ],
      email: 'sarah@gmail.com'
    }
  ];

  return (
    <div className="landing-container">
      
      {/* Top bar */}
      <div className="top-bar">
        <button className="add-member">+ Add Newmember</button>
        <span className="profile-icon">👤</span>
      </div>

      {/* Content */}
      <div className="content">
        <h1>Network</h1>
        <h2>Contact list</h2>

        <div className="search-box">
          <input placeholder="Searching" />
        </div>

        <p className="people-count">{contacts.length} people</p>

        <div className="card-list">
          {/* วนลูปแสดง Card ตามข้อมูลใน contacts */}
          {contacts.map(contact => (
            <Card
              key={contact.id}
              name={contact.name}
              name_th={contact.name_th}
              project={contact.project}
              location={contact.location}
              tags={contact.tags}
              email={contact.email}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;