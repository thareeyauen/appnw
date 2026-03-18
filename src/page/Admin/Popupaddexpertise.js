import { useState } from 'react';
import './Popupaddexpertise.css';

const Popupaddexpertise = ({ onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!label.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/expertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">Add Expertise Data</h2>
          <button className="popup-close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="popup-label">ชื่อ Expertise</p>
        <input
          className="popup-input"
          type="text"
          placeholder="เช่น Open Data, Whistle Blower..."
          value={label}
          onChange={e => setLabel(e.target.value)}
          autoFocus
        />

        <p className="popup-label">คำอธิบาย</p>
        <textarea
          className="popup-input popup-textarea"
          placeholder="อธิบายความเชี่ยวชาญนี้..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
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
