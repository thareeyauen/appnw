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

const Typeuser = () => {
  const navigate = useNavigate();
  const [typeList, setTypeList] = useState([]);
  const [search, setSearch] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  const handleDeleteClick = (item) => {
    setDeleteTarget(item);
  };

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

  const handleAdd = (saved) => {
    setTypeList(prev => [...prev, saved]);
  };

  return (
    <div className="tu-page" onClick={() => showMenu && setShowMenu(false)}>
      <div className="tu-header">
        <div className="tu-header-left">
          <button className="tu-back-btn" onClick={() => navigate('/data-management')}>
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
          <h1 className="tu-title">Add  Type of user</h1>
        </div>

        <div className="tu-profile-wrapper" onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
          <span className="tu-profile-icon"><ProfileIcon /></span>
          {showMenu && (
            <div className="tu-profile-dropdown">
              <div className="tu-dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span>
                <span className="tu-arrow">›</span>
              </div>
              <div className="tu-dropdown-item tu-logout" onClick={() => navigate('/Login')}>
                <span>Log out</span>
                <span className="tu-arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tu-content">
        <div className="tu-card">
          {/* Search bar */}
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

          {/* List */}
          <div className="tu-list">
            {filtered.map(item => (
              <div key={item.id} className="tu-list-item">
                <span className="tu-item-label">{item.label}</span>
                <button className="tu-delete-btn" onClick={() => handleDeleteClick(item)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add button */}
          <p className="tu-add-label">Add more data here</p>
          <button className="tu-add-row-btn" onClick={() => setShowPopup(true)}>
            Add type of user
          </button>
        </div>

        {error && <p className="tu-error">{error}</p>}
      </div>

      {showPopup && (
        <Popupaddtypeuser
          onClose={() => setShowPopup(false)}
          onAdd={handleAdd}
        />
      )}

      {deleteTarget && (
        <div className="tu-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="tu-modal" onClick={e => e.stopPropagation()}>
            <p className="tu-modal-text">
              ยืนยันการลบ <strong>"{deleteTarget.label}"</strong> ?
            </p>
            <div className="tu-modal-actions">
              <button className="tu-modal-cancel" onClick={() => setDeleteTarget(null)}>
                ยกเลิก
              </button>
              <button className="tu-modal-confirm" onClick={confirmDelete}>
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Typeuser;
