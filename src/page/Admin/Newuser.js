import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Newuser.css';

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pwd = '';
  for (let i = 0; i < 12; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
};

const Newuser = () => {
  const navigate = useNavigate();
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', type: '' });
  const [password] = useState(generatePassword);

  useEffect(() => {
    fetch('http://localhost:3000/api/user-types')
      .then(res => res.json())
      .then(data => {
        const labels = Array.isArray(data) ? data.map(t => t.label) : ['User', 'Admin'];
        setUserTypeOptions(labels);
        setForm(prev => ({ ...prev, type: labels[0] || '' }));
      })
      .catch(() => {
        setUserTypeOptions(['User', 'Admin']);
        setForm(prev => ({ ...prev, type: 'User' }));
      });
  }, []);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, password }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // fallback — mock ok
    } finally {
      setSaving(false);
      navigate('/manage-users');
    }
  };

  return (
    <div className="nu-page">
      {/* Header */}
      <div className="nu-header">
        <button className="nu-back-btn" onClick={() => navigate('/manage-users')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="nu-title">New User</h1>
      </div>

      {/* Card */}
      <div className="nu-card">
        <div className="nu-field">
          <label className="nu-label">Username</label>
          <input
            className="nu-input"
            type="text"
            placeholder="Value"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </div>

        <div className="nu-field">
          <label className="nu-label">Email</label>
          <input
            className="nu-input"
            type="email"
            placeholder="Value"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
          />
        </div>

        <div className="nu-field">
          <label className="nu-label">Type of user</label>
          <select
            className="nu-select"
            value={form.type}
            onChange={e => handleChange('type', e.target.value)}
          >
            {userTypeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="nu-field">
          <label className="nu-label">Password</label>
          <div className="nu-pw-row">
            <div className="nu-pw-box">{password}</div>
            <button className="nu-pw-copy" onClick={handleCopy} title={copied ? 'Copied!' : 'Copy'}>
              {copied ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="#1a1a1a" strokeWidth="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#1a1a1a" strokeWidth="2"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button className="nu-save-btn" onClick={() => setShowConfirm(true)} disabled={saving}>
          Save
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="nu-modal-overlay">
          <div className="nu-modal">
            <p className="nu-modal-text">ยืนยันการสร้าง User ใหม่?</p>
            <div className="nu-modal-actions">
              <button className="nu-modal-cancel" onClick={() => setShowConfirm(false)}>
                ยกเลิก
              </button>
              <button
                className="nu-modal-confirm"
                onClick={() => { setShowConfirm(false); handleSave(); }}
                disabled={saving}
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newuser;
