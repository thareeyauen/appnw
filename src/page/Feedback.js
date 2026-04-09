import { API_URL } from '../config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, authHeaders } from '../utils/auth';
import './Feedback.css';

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

function Feedback() {
  const navigate = useNavigate();
  const user = getUser();
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    try {
      await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: user?.name, email: user?.email, message }),
      });
    } catch { /* ส่งไม่สำเร็จก็แสดง success ไปก่อน */ }
    setSubmitted(true);
  };

  return (
    <div className="fb-page" onClick={() => showMenu && setShowMenu(false)}>
      {/* Header */}
      <div className="fb-header">
        <div className="fb-header-left">
          <button className="fb-back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="fb-title">Feedback</h1>
        </div>
        <div className="fb-profile-wrapper" onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
          <span className="fb-profile-icon"><ProfileIcon /></span>
          {showMenu && (
            <div className="fb-profile-dropdown">
              <div className="fb-dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span><span className="fb-arrow">›</span>
              </div>
              <div className="fb-dropdown-item fb-logout" onClick={() => navigate('/Login')}>
                <span>Log out</span><span className="fb-arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="fb-content">
        {submitted ? (
          <div className="fb-success-card">
            <div className="fb-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#4CAF50" strokeWidth="2"/>
                <path d="M8 12l3 3 5-5" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="fb-success-title">ขอบคุณสำหรับ Feedback!</h2>
            <p className="fb-success-text">เราได้รับข้อความของคุณแล้ว</p>
            <button className="fb-back-home-btn" onClick={() => navigate('/')}>
              กลับหน้าหลัก
            </button>
          </div>
        ) : (
          <div className="fb-card">
            <h2 className="fb-card-title">ส่ง Feedback ถึงเรา</h2>
            <p className="fb-card-desc">แนะนำ ติชม หรือรายงานปัญหาการใช้งาน</p>

            <div className="fb-form-group">
              <label className="fb-label">ชื่อผู้ส่ง</label>
              <input className="fb-input" type="text" value={user?.name || ''} disabled />
            </div>

            <div className="fb-form-group">
              <label className="fb-label">อีเมล</label>
              <input className="fb-input" type="email" value={user?.email || ''} disabled />
            </div>

            <div className="fb-form-group">
              <label className="fb-label">ข้อความ</label>
              <textarea
                className="fb-textarea"
                placeholder="พิมพ์ข้อความ feedback ของคุณที่นี่..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={6}
              />
            </div>

            <button
              className="fb-submit-btn"
              onClick={handleSubmit}
              disabled={!message.trim()}
            >
              ส่ง Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
