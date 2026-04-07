import { API_URL } from '../../config';
import { useState } from 'react';
import { authHeaders } from '../../utils/auth';
import './Popupaddtypeuser.css';

const Popupaddtypeuser = ({ onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!label.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/user-types`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ label: label.trim(), description: description.trim() }),
      });
      if (!res.ok) { setError('บันทึกไม่สำเร็จ'); return; }
      const saved = await res.json();
      onAdd(saved);
      onClose();
    } catch {
      onAdd({ id: Date.now(), label: label.trim(), description: description.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ptu-overlay" onClick={onClose}>
      <div className="ptu-box" onClick={e => e.stopPropagation()}>
        <div className="ptu-header">
          <h2 className="ptu-title">Add Type of user Data</h2>
          <button className="ptu-close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="ptu-label">ชื่อ Role</p>
        <input
          className="ptu-input"
          type="text"
          placeholder="เช่น Admin, Editor..."
          value={label}
          onChange={e => setLabel(e.target.value)}
          autoFocus
        />

        <p className="ptu-label">คำอธิบาย (สิทธิ์การเข้าถึง)</p>
        <textarea
          className="ptu-input ptu-textarea"
          placeholder="อธิบายสิทธิ์และหน้าที่ของ Role นี้..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />

        {error && <p className="ptu-error">{error}</p>}

        <button className="ptu-submit-btn" onClick={handleSubmit} disabled={saving}>
          {saving ? 'กำลังบันทึก...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Popupaddtypeuser;
