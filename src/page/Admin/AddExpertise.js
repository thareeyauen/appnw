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

const AddExpertise = () => {
  const navigate = useNavigate();
  const [expertiseList, setExpertiseList] = useState([]);
  const [search, setSearch] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  const handleDeleteClick = (item) => {
    setDeleteTarget(item);
  };

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

  const handleAdd = (saved) => {
    setExpertiseList(prev => [...prev, saved]);
  };

  return (
    <div className="ae-page" onClick={() => showMenu && setShowMenu(false)}>
      <div className="ae-header">
        <div className="ae-header-left">
          <button className="ae-back-btn" onClick={() => navigate('/data-management')}>
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
          <h1 className="ae-title">Add Expertise</h1>
        </div>

        <div className="ae-profile-wrapper" onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
          <span className="ae-profile-icon"><ProfileIcon /></span>
          {showMenu && (
            <div className="ae-profile-dropdown">
              <div className="ae-dropdown-item" onClick={() => navigate('/profile')}>
                <span>My Profile</span>
                <span className="ae-arrow">›</span>
              </div>
              <div className="ae-dropdown-item ae-logout" onClick={() => navigate('/Login')}>
                <span>Log out</span>
                <span className="ae-arrow">›</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ae-content">
        <div className="ae-card">
          {/* Search bar */}
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

          {/* List */}
          <div className="ae-list">
            {filtered.map(item => (
              <div key={item.id} className="ae-list-item">
                <span className="ae-item-label">{item.label}</span>
                <button className="ae-delete-btn" onClick={() => handleDeleteClick(item)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add button */}
          <p className="ae-add-label">Add more data here</p>
          <button className="ae-add-row-btn" onClick={() => setShowPopup(true)}>
            Add Expertise
          </button>
        </div>

        {error && <p className="ae-error">{error}</p>}
      </div>

      {showPopup && (
        <Popupaddexpertise
          onClose={() => setShowPopup(false)}
          onAdd={handleAdd}
        />
      )}

      {deleteTarget && (
        <div className="ae-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="ae-modal" onClick={e => e.stopPropagation()}>
            <p className="ae-modal-text">
              ยืนยันการลบ <strong>"{deleteTarget.label}"</strong> ?
            </p>
            <div className="ae-modal-actions">
              <button className="ae-modal-cancel" onClick={() => setDeleteTarget(null)}>
                ยกเลิก
              </button>
              <button className="ae-modal-confirm" onClick={confirmDelete}>
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddExpertise;
