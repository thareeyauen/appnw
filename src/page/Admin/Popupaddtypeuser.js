import { useState } from 'react';
import './Popupaddtypeuser.css';

const Popupaddtypeuser = ({ onClose, onAdd }) => {
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/user-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: value.trim() }),
      });
      if (!res.ok) {
        setError('บันทึกไม่สำเร็จ');
        return;
      }
      const saved = await res.json();
      onAdd(saved);
      onClose();
    } catch {
      onAdd({ id: Date.now(), label: value.trim() });
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

        <p className="ptu-label">Please type new type of user</p>
        <input
          className="ptu-input"
          type="text"
          placeholder="Value"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
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
