import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authHeaders, handleUnauthorized } from '../../utils/auth';
import '../Member.css';
import './Editmember.css';


const TAG_COLORS = {
  'Open Data':            { background: '#7BAE8E', color: 'white' },
  'Public Procurement':   { background: '#D97757', color: 'white' },
  'WhistleBlower':       { background: '#D4A96A', color: 'white' },
  'Business integrity':   { background: '#7A9BB5', color: 'white' },
};
const getTagStyle = (label) => TAG_COLORS[label] || { background: '#cab8d9', color: '#1a1a1a' };

const COUNTRIES = [
  'Afghanistan', 'Australia', 'Bangladesh', 'Brunei', 'Cambodia', 'China',
  'India', 'Indonesia', 'Japan', 'Laos', 'Malaysia', 'Maldives', 'Mongolia',
  'Myanmar', 'Nepal', 'New Zealand', 'North Korea', 'Pakistan', 'Papua New Guinea',
  'Philippines', 'Singapore', 'South Korea', 'Sri Lanka', 'Taiwan', 'Thailand',
  'Timor-Leste', 'Vietnam', 'Other',
];

const Editmember = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expertiseOptions, setExpertiseOptions] = useState([]);
  const [expertiseDescMap, setExpertiseDescMap] = useState({});
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [otherActive, setOtherActive] = useState(false);
  const [otherLabel, setOtherLabel] = useState('');
  const [otherDesc, setOtherDesc] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [nameCardPreview, setNameCardPreview] = useState(null);
  const [nameCardFile, setNameCardFile] = useState(null);
  const [nameCardFileName, setNameCardFileName] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/expertise')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        setExpertiseOptions(data.map(e => e.label));
        const map = {};
        data.forEach(e => { map[e.label] = e.description || ''; });
        setExpertiseDescMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/api/people/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Member not found');
        return response.json();
      })
      .then(data => {
        setMember(data);
        setAvatarPreview(data.photo ? `http://localhost:3000${data.photo}` : null);
        setNameCardPreview(data.nameCard ? `http://localhost:3000${data.nameCard}` : null);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (field, value) => {
    setMember(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleNameCardChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNameCardFile(file);
    setNameCardPreview(URL.createObjectURL(file));
    setNameCardFileName(file.name);
  };

  const togglePredefinedTag = (label) => {
    setMember(prev => {
      const current = prev.tags || [];
      const exists = current.some(t => t.label === label);
      return {
        ...prev,
        tags: exists
          ? current.filter(t => t.label !== label)
          : [...current, { label }],
      };
    });
  };

  const handleRemoveTag = (index) => {
    setMember(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (avatarFile) {
        const form = new FormData();
        form.append('photo', avatarFile);
        const photoRes = await fetch(`http://localhost:3000/api/people/${id}/photo`, {
          method: 'POST',
          headers: { Authorization: authHeaders().Authorization },
          body: form,
        });
        if (!photoRes.ok) throw new Error('อัปโหลดรูปโปรไฟล์ไม่สำเร็จ');
      }

      if (nameCardFile) {
        const form = new FormData();
        form.append('nameCard', nameCardFile);
        const ncRes = await fetch(`http://localhost:3000/api/people/${id}/namecard`, {
          method: 'POST',
          headers: { Authorization: authHeaders().Authorization },
          body: form,
        });
        if (!ncRes.ok) throw new Error('อัปโหลด Name Card ไม่สำเร็จ');
      }

      const tagsToSave = [...(member.tags || [])];
      if (otherActive && otherLabel.trim()) {
        tagsToSave.push({ label: otherLabel.trim(), description: otherDesc.trim() });
      }
      const { photo, nameCard, ...memberData } = member;
      const response = await fetch(`http://localhost:3000/api/people/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ ...memberData, tags: tagsToSave }),
      });
      if (!response.ok) {
        if (handleUnauthorized(response.status)) return;
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Save failed (${response.status})`);
      }

      if (otherActive && otherLabel.trim()) {
        fetch('http://localhost:3000/api/expertise', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ label: otherLabel.trim(), description: otherDesc.trim() }),
        }).catch(() => {});
      }

      navigate('/manage-members');
    } catch (error) {
      console.error('Error saving:', error);
      alert(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/people/${id}`, {
        method: 'DELETE',
        headers: authHeaders(false),
      });
      if (!response.ok) throw new Error('Delete failed');
      navigate('/manage-members');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('เกิดข้อผิดพลาดในการลบ');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!member) return <div className="error">Member not found!</div>;

  return (
    <div className="member-page">
      {/* Header */}
      <div className="member-header">
        <button className="back-button" onClick={() => navigate('/manage-members')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="member-header-title">Edit Member</h1>
      </div>

      <div className="member-content">

        {/* Avatar — คลิกเพื่ออัปโหลดรูป */}
        <label className="em-avatar-label">
          <div className="profile-avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="avatar-preview" />
            ) : (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <div className="em-avatar-overlay">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </label>

        {/* Personal Detail */}
        <section className="detail-section">
          <h2 className="section-title">Personal Detail</h2>

          <div className="form-group">
            <label className="form-label">Name - Surname (EN)</label>
            <input
              type="text"
              className="form-input"
              value={member.name || ''}
              onChange={e => handleChange('name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ชื่อ - นามสกุล (ไทย)</label>
            <input
              type="text"
              className="form-input"
              value={member.name_th || ''}
              onChange={e => handleChange('name_th', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">National / สัญชาติ</label>
            <select
              className="form-input"
              value={member.location || ''}
              onChange={e => handleChange('location', e.target.value)}
            >
              <option value="">-- เลือกสัญชาติ --</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email / อีเมล</label>
            <input
              type="email"
              className="form-input"
              value={member.email || ''}
              onChange={e => handleChange('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expertise / ความเชี่ยวชาญ</label>
            <div className="expertise-pills">
              {expertiseOptions.map(opt => {
                const active = (member.tags || []).some(t => t.label === opt);
                return (
                  <div key={opt} className="expertise-pill-wrap">
                    <button
                      type="button"
                      className={`expertise-pill${active ? ' expertise-pill--active' : ''}`}
                      style={active ? getTagStyle(opt) : {}}
                      onClick={() => togglePredefinedTag(opt)}
                    >
                      {opt}
                    </button>
                    {expertiseDescMap[opt] && <span className="expertise-pill-tooltip">{expertiseDescMap[opt]}</span>}
                  </div>
                );
              })}
              <div className="expertise-pill-wrap">
                <button
                  type="button"
                  className={`expertise-pill${otherActive ? ' expertise-pill--active' : ''}`}
                  style={otherActive ? { background: '#cab8d9', color: '#1a1a1a', borderColor: 'transparent' } : {}}
                  onClick={() => setOtherActive(v => !v)}
                >
                  Other
                </button>
              </div>
            </div>
            {otherActive && (
              <div className="other-expertise-fields">
                <input
                  type="text"
                  className="form-input"
                  placeholder="ระบุความเชี่ยวชาญของคุณ"
                  value={otherLabel}
                  onChange={e => setOtherLabel(e.target.value)}
                />
                <textarea
                  className="form-input other-expertise-desc"
                  placeholder="คำอธิบายเพิ่มเติม"
                  value={otherDesc}
                  onChange={e => setOtherDesc(e.target.value)}
                  rows={3}
                />
              </div>
            )}
            {/* Custom (non-predefined) tags */}
            {(member.tags || []).filter(t => !expertiseOptions.includes(t.label)).length > 0 && (
              <div className="tag-container" style={{ marginTop: '10px' }}>
                {(member.tags || []).map((tag, index) =>
                  expertiseOptions.includes(tag.label) ? null : (
                    <div key={index} className="expertise-pill-wrap">
                      <span className="tag" style={getTagStyle(tag.label)}>
                        {tag.label}
                        <button className="em-tag-remove" onClick={() => handleRemoveTag(index)}>×</button>
                      </span>
                      {tag.description && <span className="expertise-pill-tooltip">{tag.description}</span>}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Other Network / เครือข่ายอื่น ๆ</label>
            <input
              type="text"
              className="form-input"
              value={member.network || ''}
              onChange={e => handleChange('network', e.target.value)}
            />
          </div>
        </section>

        {/* Organization Detail */}
        <section className="detail-section">
          <h2 className="section-title">Organization Detail</h2>

          <div className="form-group">
            <label className="form-label">Organization Name (EN)</label>
            <input
              type="text"
              className="form-input"
              value={member.project || ''}
              onChange={e => handleChange('project', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ชื่อองค์กร (ไทย)</label>
            <input
              type="text"
              className="form-input"
              value={member.project_th || ''}
              onChange={e => handleChange('project_th', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Position (EN)</label>
            <input
              type="text"
              className="form-input"
              value={member.position || ''}
              onChange={e => handleChange('position', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ตำแหน่ง (ไทย)</label>
            <input
              type="text"
              className="form-input"
              value={member.position_th || ''}
              onChange={e => handleChange('position_th', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country / ประเทศ</label>
            <select
              className="form-input"
              value={member.country || ''}
              onChange={e => handleChange('country', e.target.value)}
            >
              <option value="">-- เลือกประเทศ --</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Note */}
        <div className="note-section">
          <h2 className="note-title">Note</h2>
          <textarea
            className="form-input note-textarea"
            value={member.note || ''}
            onChange={e => handleChange('note', e.target.value)}
          />
        </div>

        {/* Name Card */}
        <div className="name-card-preview-section">
          {nameCardPreview && (
            <img src={nameCardPreview} alt="Name Card" className="name-card-image" style={{ marginBottom: '12px' }} />
          )}
          <div className="em-namecard-row">
            <label className="em-namecard-btn">
              <span className="em-namecard-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#1a1a1a"/>
                  <path d="M3 17l5-5 4 4 3-3 6 6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
                </svg>
              </span>
              <span className="em-namecard-label">
                {nameCardFileName || (nameCardPreview ? 'เปลี่ยน Name Card' : 'Add Name Card')}
              </span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleNameCardChange}
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="em-action-row">
          <button className="em-save-btn" onClick={() => setShowSaveConfirm(true)} disabled={saving}>
            {saving ? 'กำลังบันทึก...' : 'Save'}
          </button>
          <button className="em-delete-btn" onClick={() => setShowDeleteConfirm(true)} disabled={deleting}>
            Delete
          </button>
        </div>
      </div>

      {/* Save Confirm Modal */}
      {showSaveConfirm && (
        <div className="em-modal-overlay">
          <div className="em-modal">
            <p className="em-modal-text">ยืนยันการบันทึกข้อมูล?</p>
            <div className="em-modal-actions">
              <button className="em-modal-cancel" onClick={() => setShowSaveConfirm(false)}>
                ยกเลิก
              </button>
              <button
                className="em-modal-confirm em-modal-confirm-save"
                onClick={() => { setShowSaveConfirm(false); handleSave(); }}
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
        <div className="em-modal-overlay">
          <div className="em-modal">
            <p className="em-modal-text">ยืนยันการลบสมาชิกนี้?</p>
            <div className="em-modal-actions">
              <button className="em-modal-cancel" onClick={() => setShowDeleteConfirm(false)}>
                ยกเลิก
              </button>
              <button className="em-modal-confirm" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'กำลังลบ...' : 'ลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editmember;
