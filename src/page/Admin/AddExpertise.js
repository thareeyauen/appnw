import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddExpertise.css';
import Popupaddexpertise from './Popupaddexpertise';

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AddExpertise = () => {
  const navigate = useNavigate();
  const [expertiseList, setExpertiseList] = useState([]);
  const [search, setSearch] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/expertise')
      .then(res => res.json())
      .then(data => setExpertiseList(Array.isArray(data) ? data : []))
      .catch(() => setError('ไม่สามารถโหลดข้อมูลได้'));
  }, []);

  const filtered = expertiseList.filter(e =>
    e.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (item) => setDeleteTarget(item);

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3000/api/expertise/${deleteTarget.id}`, { method: 'DELETE' });
      setExpertiseList(prev => prev.filter(e => e.id !== deleteTarget.id));
    } catch {
      setError('ลบไม่สำเร็จ');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleEditClick = (item) => {
    setEditTarget(item);
    setEditDesc(item.description || '');
  };

  const handleSaveDesc = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:3000/api/expertise/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: editDesc }),
      });
    } catch { /* optimistic — update anyway */ }
    setExpertiseList(prev => prev.map(e =>
      e.id === editTarget.id ? { ...e, description: editDesc } : e
    ));
    setSaving(false);
    setEditTarget(null);
  };

  const handleAdd = (saved) => setExpertiseList(prev => [...prev, saved]);

  return (
    <div className="ae-page" onClick={() => showMenu && setShowMenu(false)}>
      <div className="ae-header">
        <div className="ae-header-left">
          <button className="ae-back-btn" onClick={() => navigate('/data-management')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="ae-title">Add Expertise</h1>
        </div>

        <div className="ae-profile-wrapper" onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
          <span className="ae-profile-icon"><ProfileIcon /></span>
          {showMenu && (
            <div className="ae-profile-dropdown">
              <div className="ae-dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span><span className="ae-arrow">›</span>
              </div>
              <div className="ae-dropdown-item ae-logout" onClick={() => navigate('/Login')}>
                <span>Log out</span><span className="ae-arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ae-content">
        <div className="ae-card">
          <div className="ae-search-row">
            <svg className="ae-icon-menu" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              className="ae-search-input"
              type="text"
              placeholder="Hinted search text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <svg className="ae-icon-search" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#555" strokeWidth="2"/>
              <path d="M16.5 16.5L21 21" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="ae-list">
            {filtered.map(item => (
              <div key={item.id} className="ae-list-item">
                <div className="ae-item-info">
                  <span className="ae-item-label">{item.label}</span>
                  {item.description
                    ? <span className="ae-item-desc">{item.description}</span>
                    : <span className="ae-item-desc ae-item-desc--empty">ยังไม่มีคำอธิบาย</span>
                  }
                </div>
                <div className="ae-item-actions">
                  <button className="ae-edit-btn" title="แก้ไขคำอธิบาย" onClick={() => handleEditClick(item)}>
                    <PencilIcon />
                  </button>
                  <button className="ae-delete-btn" title="ลบ" onClick={() => handleDeleteClick(item)}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="ae-add-label">Add more data here</p>
          <button className="ae-add-row-btn" onClick={() => setShowPopup(true)}>
            Add Expertise
          </button>
        </div>

        {error && <p className="ae-error">{error}</p>}
      </div>

      {showPopup && (
        <Popupaddexpertise onClose={() => setShowPopup(false)} onAdd={handleAdd} />
      )}

      {/* Edit description modal */}
      {editTarget && (
        <div className="ae-modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="ae-modal ae-edit-modal" onClick={e => e.stopPropagation()}>
            <p className="ae-modal-title">แก้ไขคำอธิบาย</p>
            <p className="ae-edit-role-name">"{editTarget.label}"</p>
            <textarea
              className="ae-edit-textarea"
              placeholder="อธิบายความเชี่ยวชาญนี้..."
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="ae-modal-actions">
              <button className="ae-modal-cancel" onClick={() => setEditTarget(null)}>ยกเลิก</button>
              <button className="ae-modal-save" onClick={handleSaveDesc} disabled={saving}>
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="ae-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="ae-modal" onClick={e => e.stopPropagation()}>
            <p className="ae-modal-text">
              ยืนยันการลบ <strong>"{deleteTarget.label}"</strong> ?
            </p>
            <div className="ae-modal-actions">
              <button className="ae-modal-cancel" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
              <button className="ae-modal-confirm" onClick={confirmDelete}>ลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddExpertise;
