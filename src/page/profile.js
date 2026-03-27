import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, authHeaders } from '../utils/auth';
import './profile.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const STATUS_LABEL = {
  pending:  { text: 'รอดำเนินการ', cls: 'status-pending' },
  approved: { text: 'อนุมัติแล้ว',  cls: 'status-approved' },
  rejected: { text: 'ถูกปฏิเสธ',   cls: 'status-rejected' },
};

const Profile = () => {
  const navigate = useNavigate();

  const user   = getUser() || { type: '', name: '', email: '' };
  const LS_KEY = `mySubmissions_${user.email}`;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'เกิดข้อผิดพลาด');
      alert('เปลี่ยนรหัสผ่านสำเร็จ');
      setOldPassword('');
      setNewPassword('');
      setShowResetModal(false);
    } catch {
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  useEffect(() => {
    let cancelled = false;
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

    if (stored.length === 0) {
      setLoading(false);
      return () => { cancelled = true; };
    }

    const pendingItems = stored.filter(s => s.status === 'pending');

    if (pendingItems.length === 0) {
      setRequests(stored);
      setLoading(false);
      return () => { cancelled = true; };
    }

    Promise.allSettled(
      pendingItems.map(s =>
        fetch(`http://localhost:3000/api/submissions/${s.id}`, { headers: authHeaders(false) })
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      if (cancelled) return;
      const statusMap = {};
      pendingItems.forEach((s, i) => {
        const val = results[i].value;
        if (val && val.status) {
          statusMap[String(s.id)] = val.status;
        }
      });

      const current = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      const updated = current.map(s => {
        if (s.status !== 'pending') return s;
        const apiStatus = statusMap[String(s.id)];
        if (!apiStatus) return s;
        return { ...s, status: apiStatus };
      });

      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      setRequests(updated);
    }).finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const handleCancel = (id) => {
    const current = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    const updated = current.filter(r => String(r.id) !== String(id));
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    setRequests(updated);
    fetch(`http://localhost:3000/api/submissions/${id}`, { method: 'DELETE', headers: authHeaders(false) })
      .catch(() => {});
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => navigate(-1)}>
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
        <h1 className="profile-title">My profile</h1>
      </div>

      <div className="profile-content">
        {/* Personal Details */}
        <h2 className="profile-section-heading">Personal  Details</h2>
        <div className="profile-details-card">
          <div className="profile-field">
            <span className="profile-field-label">Type of user</span>
            <div className="profile-field-value">{user.type}</div>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Name - Surname (EN)</span>
            <div className="profile-field-value">{user.name}</div>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Email</span>
            <div className="profile-field-value profile-field-muted">{user.email}</div>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Password</span>
            <button className="reset-password-btn" onClick={() => setShowResetModal(true)}>Reset Password</button>
          </div>
        </div>

        {/* My Request */}
        <h2 className="profile-section-heading">My Request</h2>
        {loading ? (
          <p className="profile-empty">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="profile-empty">ยังไม่มี Request</p>
        ) : (
          <div className="request-list">
            {requests.map(req => {
              const status = req.status || 'pending';
              const badge = STATUS_LABEL[status] || STATUS_LABEL.pending;
              const isPending = status === 'pending';

              return (
                <div key={req.id} className="req-card">
                  <div className="req-card-header">
                    <span>
                      Submit by {user.name}
                      {req.created_at ? ` - ${formatDate(req.created_at)}` : ''}
                    </span>
                    <span className={`req-status-badge ${badge.cls}`}>
                      {badge.text}
                    </span>
                  </div>

                  <ul className="req-card-list">
                    <li><span className="req-label">Name:</span> {req.name || '-'}</li>
                    <li><span className="req-label">Org:</span> {req.project || '-'}</li>
                    <li><span className="req-label">Country:</span> {req.country || req.location || '-'}</li>
                  </ul>

                  {isPending && (
                    <div className="req-card-footer">
                      <button
                        className="cancel-request-btn"
                        onClick={() => handleCancel(req.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Reset Password Modal ── */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Reset Password</h2>
              <button className="modal-close-btn" onClick={() => setShowResetModal(false)}>✕</button>
            </div>

            <div className="modal-field">
              <label className="modal-label">Old Password</label>
              <input
                type="password"
                className="modal-input"
                placeholder="Value"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">New Password</label>
              <input
                type="password"
                className="modal-input"
                placeholder="Value"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <button className="modal-save-btn" onClick={handleResetPassword}>SAVE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
