import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Typeuser.css';
import Popupaddtypeuser from './Popupaddtypeuser';

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

const Typeuser = () => {
  const navigate = useNavigate();
  const [typeList, setTypeList] = useState([]);
  const [search, setSearch] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/user-types')
      .then(res => res.json())
      .then(data => setTypeList(Array.isArray(data) ? data : []))
      .catch(() => setError('ไม่สามารถโหลดข้อมูลได้'));
  }, []);

  const filtered = typeList.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (item) => setDeleteTarget(item);

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3000/api/user-types/${deleteTarget.id}`, { method: 'DELETE' });
      setTypeList(prev => prev.filter(t => t.id !== deleteTarget.id));
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
      await fetch(`http://localhost:3000/api/user-types/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: editDesc }),
      });
      setTypeList(prev => prev.map(t =>
        t.id === editTarget.id ? { ...t, description: editDesc } : t
      ));
    } catch {
      setTypeList(prev => prev.map(t =>
        t.id === editTarget.id ? { ...t, description: editDesc } : t
      ));
    } finally {
      setSaving(false);
      setEditTarget(null);
    }
  };

  const handleAdd = (saved) => setTypeList(prev => [...prev, saved]);

  return (
    <div className="tu-page" onClick={() => showMenu && setShowMenu(false)}>
      <div className="tu-header">
        <div className="tu-header-left">
          <button className="tu-back-btn" onClick={() => navigate('/data-management')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="tu-title">Add  Type of user</h1>
        </div>

        <div className="tu-profile-wrapper" onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
          <span className="tu-profile-icon"><ProfileIcon /></span>
          {showMenu && (
            <div className="tu-profile-dropdown">
              <div className="tu-dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span><span className="tu-arrow">›</span>
              </div>
              <div className="tu-dropdown-item tu-logout" onClick={() => navigate('/Login')}>
                <span>Log out</span><span className="tu-arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tu-content">
        <div className="tu-card">
          <div className="tu-search-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              className="tu-search-input"
              type="text"
              placeholder="Hinted search text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#555" strokeWidth="2"/>
              <path d="M16.5 16.5L21 21" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="tu-list">
            {filtered.map(item => (
              <div key={item.id} className="tu-list-item">
                <div className="tu-item-info">
                  <span className="tu-item-label">{item.label}</span>
                  {item.description
                    ? <span className="tu-item-desc">{item.description}</span>
                    : <span className="tu-item-desc tu-item-desc--empty">ยังไม่มีคำอธิบาย</span>
                  }
                </div>
                <div className="tu-item-actions">
                  <button className="tu-edit-btn" title="แก้ไขคำอธิบาย" onClick={() => handleEditClick(item)}>
                    <PencilIcon />
                  </button>
                  <button className="tu-delete-btn" title="ลบ" onClick={() => handleDeleteClick(item)}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="tu-add-label">Add more data here</p>
          <button className="tu-add-row-btn" onClick={() => setShowPopup(true)}>
            Add type of user
          </button>
        </div>

        {error && <p className="tu-error">{error}</p>}
      </div>

      {showPopup && (
        <Popupaddtypeuser onClose={() => setShowPopup(false)} onAdd={handleAdd} />
      )}

      {/* Edit description modal */}
      {editTarget && (
        <div className="tu-modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="tu-modal tu-edit-modal" onClick={e => e.stopPropagation()}>
            <p className="tu-modal-title">แก้ไขคำอธิบาย</p>
            <p className="tu-edit-role-name">"{editTarget.label}"</p>
            <textarea
              className="tu-edit-textarea"
              placeholder="อธิบายสิทธิ์และหน้าที่ของ Role นี้..."
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="tu-modal-actions">
              <button className="tu-modal-cancel" onClick={() => setEditTarget(null)}>
                ยกเลิก
              </button>
              <button className="tu-modal-save" onClick={handleSaveDesc} disabled={saving}>
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="tu-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="tu-modal" onClick={e => e.stopPropagation()}>
            <p className="tu-modal-text">
              ยืนยันการลบ <strong>"{deleteTarget.label}"</strong> ?
            </p>
            <div className="tu-modal-actions">
              <button className="tu-modal-cancel" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
              <button className="tu-modal-confirm" onClick={confirmDelete}>ลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Typeuser;
