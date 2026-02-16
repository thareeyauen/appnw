import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Member.css';

const Member = (name,name_th,email) => {
  const navigate = useNavigate();
  const { id } = useParams();  // รับ id จาก URL

  const handleBack = () => {
    navigate('/');  // กลับไปหน้า Landing
  };

  return (
    <div className="member-page">
      {/* Header */}
      <div className="member-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="member-header-title">Member</h1>
      </div>

      {/* Profile Section */}
      <div className="member-content">
        <div className="profile-avatar">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="currentColor"/>
            <path 
              d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Personal Detail */}
        <section className="detail-section">
          <h2 className="section-title">Personal Detail</h2>
          
          <div className="form-group">
            <label className="form-label">Name - Surname (EN)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder= {name} 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">ชื่อ - นามสกุล (ไทย)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder={name_th}
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">National / สัญชาติ</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Malaysia" 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email / อีเมล</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder={email} 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expertise / ความเชี่ยวชาญ</label>
            <div className="tag-container">
              <span className="tag tag-primary">Open Data</span>
              <span className="tag tag-secondary">Procurement</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Other Network / เครือข่ายอื่นๆ</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="JAC Network" 
              readOnly 
            />
          </div>
        </section>

        {/* Organization Detail */}
        <section className="detail-section">
          <h2 className="section-title">Organization Detail</h2>
          
          <div className="form-group">
            <label className="form-label">Organization Name (EN)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Sinar Project" 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">ชื่อองค์กร (ไทย)</label>
            <input 
              type="text" 
              className="form-input" 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Position (EN)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Project Coordinator" 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">ตำแหน่ง (ไทย)</label>
            <input 
              type="text" 
              className="form-input" 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country / ประเทศ</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Malaysia" 
              readOnly 
            />
          </div>
        </section>

        {/* Note */}
        <section className="detail-section">
          <h2 className="section-title">Note</h2>
          
          <div className="form-group">
            <textarea 
              className="form-textarea" 
              placeholder="เคยเจอที่งาน xx" 
              rows="4" 
              readOnly
            ></textarea>
          </div>
        </section>

        {/* Name Card */}
        <section className="detail-section">
          <h2 className="section-title">Name Card</h2>
          
          <div className="name-card-upload">
            <div className="upload-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="upload-text">name.png</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Member;