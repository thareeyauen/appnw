import { useState } from 'react';
import './Popupaddexpertise.css';

const Popupaddexpertise = ({ onClose, onAdd }) => {
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/expertise', {
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
      // backend ไม่ได้รัน — เพิ่ม item ใน list พร้อม temp id
      onAdd({ id: Date.now(), label: value.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">Add Expertise Data</h2>
          <button className="popup-close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="popup-label">Please type new expertise</p>
        <input
          className="popup-input"
          type="text"
          placeholder="Value"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />

        {error && <p className="popup-error">{error}</p>}

        <button className="popup-submit-btn" onClick={handleSubmit} disabled={saving}>
          {saving ? 'กำลังบันทึก...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Popupaddexpertise;
