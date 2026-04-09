import { API_URL } from '../../config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authHeaders, handleUnauthorized } from '../../utils/auth';
import './Feedback_admin.css';

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeedbackAdmin = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/feedback`, { headers: authHeaders(false) })
      .then(res => { handleUnauthorized(res.status); return res.json(); })
      .then(data => setFeedbacks(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    try {
      await fetch(`${API_URL}/api/feedback/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: authHeaders(false),
      });
      setFeedbacks(prev => prev.filter(f => f.id !== deleteTarget.id));
    } catch { /* ignore */ }
    setDeleteTarget(null);
  };

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="fba-page" onClick={() => showMenu && setShowMenu(false)}>
      {/* Header */}
      <div className="fba-header">
        <div className="fba-header-left">
          <button className="fba-back-btn" onClick={() => navigate('/admin')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="fba-title">Feedback</h1>
        </div>
        <div className="fba-profile-wrapper" onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
          <span className="fba-profile-icon"><ProfileIcon /></span>
          {showMenu && (
            <div className="fba-profile-dropdown">
              <div className="fba-dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span><span className="fba-arrow">›</span>
              </div>
              <div className="fba-dropdown-item" onClick={() => navigate('/feedback')}>
                <span>Feedback</span><span className="fba-arrow">›</span>
              </div>
              <div className="fba-dropdown-item fba-logout" onClick={() => navigate('/Login')}>
                <span>Log out</span><span className="fba-arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="fba-content">
        <p className="fba-count">{feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''}</p>

        {loading ? (
          <p className="fba-loading">Loading...</p>
        ) : feedbacks.length === 0 ? (
          <div className="fba-empty">
            <p>ยังไม่มี feedback</p>
          </div>
        ) : (
          <div className="fba-list">
            {feedbacks.map(fb => (
              <div key={fb.id} className="fba-card">
                <div className="fba-card-top">
                  <div className="fba-card-user">
                    <span className="fba-card-name">{fb.name || 'ไม่ระบุชื่อ'}</span>
                    <span className="fba-card-email">{fb.email}</span>
                  </div>
                  <button className="fba-delete-btn" title="ลบ" onClick={() => setDeleteTarget(fb)}>
                    <TrashIcon />
                  </button>
                </div>
                <p className="fba-card-message">{fb.message}</p>
                <span className="fba-card-date">{formatDate(fb.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fba-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="fba-modal" onClick={e => e.stopPropagation()}>
            <p className="fba-modal-text">ยืนยันการลบ feedback นี้?</p>
            <div className="fba-modal-actions">
              <button className="fba-modal-cancel" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
              <button className="fba-modal-confirm" onClick={confirmDelete}>ลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackAdmin;
