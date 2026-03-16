import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Edituser.css';

const MOCK_USERS = [
  { id: 1, name: 'Saranchanok', email: 'Saranchanok@hand.co.th', type: 'User' },
  { id: 2, name: 'Admin01',     email: 'admin01@hand.co.th',     type: 'Admin' },
];


const Edituser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDoneConfirm, setShowDoneConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [randomPassword, setRandomPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [pendingPassword, setPendingPassword] = useState(null);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pwd = '';
    for (let i = 0; i < 12; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    return pwd;
  };

  const handleOpenPasswordModal = () => {
    setRandomPassword(generatePassword());
    setCopied(false);
    setShowPasswordModal(true);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(randomPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/user-types')
      .then(res => res.json())
      .then(data => setUserTypeOptions(Array.isArray(data) ? data.map(t => t.label) : []))
      .catch(() => setUserTypeOptions(['User', 'Admin']));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${id}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setUser(data); setLoading(false); })
      .catch(() => {
        const found = MOCK_USERS.find(u => u.id === parseInt(id));
        setUser(found || null);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { name: user.name, email: user.email, type: user.type };
    if (pendingPassword) payload.password = pendingPassword;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
    } catch {
      // fallback — mock save ok
    } finally {
      setSaving(false);
      navigate('/manage-users');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      // fallback — mock delete ok
    } finally {
      setDeleting(false);
      navigate('/manage-users');
    }
  };

  if (loading) return <div className="eu-loading">Loading...</div>;
  if (!user) return <div className="eu-loading">User not found</div>;

  return (
    <div className="eu-page">
      {/* Header */}
      <div className="eu-header">
        <button className="eu-back-btn" onClick={() => navigate('/manage-users')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="eu-title">Edit User</h1>
      </div>

      {/* Card */}
      <div className="eu-card">

        <div className="eu-field">
          <label className="eu-label">Name</label>
          <input
            className="eu-input"
            type="text"
            value={user.name || ''}
            onChange={e => handleChange('name', e.target.value)}
          />
        </div>

        <div className="eu-field">
          <label className="eu-label">Email</label>
          <input
            className="eu-input"
            type="email"
            value={user.email || ''}
            onChange={e => handleChange('email', e.target.value)}
          />
        </div>

        <div className="eu-field">
          <label className="eu-label">Type of user</label>
          <select
            className="eu-select"
            value={user.type || ''}
            onChange={e => handleChange('type', e.target.value)}
          >
            {userTypeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="eu-field">
          <label className="eu-label">Password</label>
          <button
            className="eu-reset-btn"
            type="button"
            onClick={handleOpenPasswordModal}
          >
            Reset Password
          </button>
          {pendingPassword && (
            <span className="eu-pw-confirmed">✓ ตั้งรหัสผ่านใหม่แล้ว</span>
          )}
        </div>

      </div>

      {/* Action Buttons */}
      <div className="eu-action-row">
        <button className="eu-done-btn" onClick={() => setShowDoneConfirm(true)} disabled={saving}>
          Save
        </button>
        <button className="eu-delete-btn" onClick={() => setShowDeleteConfirm(true)} disabled={deleting}>
          Delete
        </button>
      </div>

      {/* Random Password Modal */}
      {showPasswordModal && (
        <div className="eu-modal-overlay">
          <div className="eu-pw-modal">
            <button className="eu-pw-close" onClick={() => setShowPasswordModal(false)}>
              ✕
            </button>
            <h2 className="eu-pw-title">Random Password</h2>
            <div className="eu-pw-row">
              <div className="eu-pw-box">{randomPassword}</div>
              <button
                className="eu-pw-copy"
                onClick={handleCopyPassword}
                title={copied ? 'Copied!' : 'Copy'}
              >
                {copied ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="#1a1a1a" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#1a1a1a" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
            <button
              className="eu-pw-refresh"
              onClick={() => { setRandomPassword(generatePassword()); setCopied(false); }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 20v-6h-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="eu-pw-save-btn"
              onClick={() => { setPendingPassword(randomPassword); setShowPasswordModal(false); }}
            >
              Save Password
            </button>
          </div>
        </div>
      )}

      {/* DONE Confirm Modal */}
      {showDoneConfirm && (
        <div className="eu-modal-overlay">
          <div className="eu-modal">
            <p className="eu-modal-text">ยืนยันการบันทึกข้อมูล?</p>
            <div className="eu-modal-actions">
              <button className="eu-modal-cancel" onClick={() => setShowDoneConfirm(false)}>
                ยกเลิก
              </button>
              <button
                className="eu-modal-confirm eu-modal-confirm-save"
                onClick={() => { setShowDoneConfirm(false); handleSave(); }}
                disabled={saving}
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="eu-modal-overlay">
          <div className="eu-modal">
            <p className="eu-modal-text">ยืนยันการลบ User นี้?</p>
            <div className="eu-modal-actions">
              <button className="eu-modal-cancel" onClick={() => setShowDeleteConfirm(false)}>
                ยกเลิก
              </button>
              <button
                className="eu-modal-confirm eu-modal-confirm-delete"
                onClick={() => { setShowDeleteConfirm(false); handleDelete(); }}
                disabled={deleting}
              >
                {deleting ? 'กำลังลบ...' : 'ลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edituser;
