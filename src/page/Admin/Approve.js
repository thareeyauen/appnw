import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Approve.css';

const EXPERTISE_OPTIONS = [
  'Open Data',
  'Public Procurement',
  'Whistle Blower',
  'Business Integrity',
  'Other',
];

const COUNTRY_OPTIONS = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium',
  'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cambodia',
  'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
  'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Finland', 'France',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Hungary', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lithuania',
  'Luxembourg', 'Malaysia', 'Mexico', 'Mongolia', 'Morocco', 'Myanmar',
  'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'North Korea', 'Norway',
  'Oman', 'Pakistan', 'Palestine', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'Singapore',
  'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zimbabwe',
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};


const Approve = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    name_th: '',
    location: '',
    email: '',
    tags: '',
    tagsOther: '',
    network: '',
    project: '',
    project_th: '',
    position: '',
    position_th: '',
    country: '',
    note: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [nameCardName, setNameCardName] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/api/admin/submissions/${id}`)
      .then((res) => {
        console.log('[Approve] HTTP status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('[Approve] API response:', data);
        setMember(data);
        const tagLabel =
          Array.isArray(data.tags) && data.tags.length > 0
            ? data.tags[0].label
            : typeof data.tags === 'string'
            ? data.tags
            : '';
        const isKnownTag = EXPERTISE_OPTIONS.slice(0, -1).includes(tagLabel);
        setFormData({
          name: data.name || '',
          name_th: data.name_th || '',
          location: data.location || '',
          email: data.email || '',
          tags: isKnownTag ? tagLabel : tagLabel ? 'Other' : '',
          tagsOther: isKnownTag ? '' : tagLabel,
          network: data.network || '',
          project: data.project || '',
          project_th: data.project_th || '',
          position: data.position || '',
          position_th: data.position_th || '',
          country: data.country || '',
          note: data.note || '',
        });
        if (data.avatar) setProfileImage(data.avatar);
        if (data.nameCard) setNameCardName(data.nameCard);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching member:', err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    setError(null);
    setSubmitting(true);

    const tagLabel = formData.tags === 'Other' ? formData.tagsOther : formData.tags;
    const tagsArray = tagLabel ? [{ label: tagLabel }] : [];

    const payload = {
      name: formData.name,
      name_th: formData.name_th,
      location: formData.location,
      email: formData.email,
      tags: tagsArray,
      network: formData.network,
      project: formData.project,
      project_th: formData.project_th,
      position: formData.position,
      position_th: formData.position_th,
      country: formData.country,
      note: formData.note,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/admin/submissions/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`เกิดข้อผิดพลาด (${response.status})`);

      setSuccess(true);
      setTimeout(() => navigate('/requirements'), 1500);
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);

    try {
      const response = await fetch(`http://localhost:3000/api/admin/submissions/${id}/reject`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error(`เกิดข้อผิดพลาด (${response.status})`);

      navigate('/requirements');
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      } else {
        setError(err.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="approve-page">
        <p className="approve-loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="approve-page">
      {/* Header */}
      <div className="approve-header">
        <button className="back-button" onClick={() => navigate('/requirements')} type="button">
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
        <h1 className="approve-header-title">Approvement</h1>
      </div>

      <div className="approve-content">
        {/* Avatar */}
        <label className="approve-avatar-label">
          <div className="approve-avatar">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="approve-avatar-img" />
            ) : (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="#9b8fc7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" stroke="#9b8fc7" strokeWidth="2" />
              </svg>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setProfileImage(URL.createObjectURL(file));
            }}
          />
        </label>
        <p className="approve-submit-info">
          Submit by {member?.name || '-'}&nbsp;-&nbsp;{formatDate(member?.created_at)}
        </p>

        {/* Personal Detail */}
        <section className="approve-section">
          <h2 className="approve-section-title">Personal Detail</h2>

          <div className="approve-form-group">
            <label className="approve-label">Name - Surname (EN)</label>
            <input
              type="text"
              name="name"
              className="approve-input"
              placeholder="e.g. John Smith"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="approve-form-group">
            <label className="approve-label">ชื่อ - นามสกุล (ไทย)</label>
            <input
              type="text"
              name="name_th"
              className="approve-input"
              placeholder="เช่น จอห์น สมิธ"
              value={formData.name_th}
              onChange={handleChange}
            />
          </div>

          <div className="approve-form-group">
            <label className="approve-label">National / สัญชาติ</label>
            <select
              name="location"
              className="approve-input approve-select"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">-- เลือกสัญชาติ --</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="approve-form-group">
            <label className="approve-label">Email / อีเมล</label>
            <input
              type="email"
              name="email"
              className="approve-input"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="approve-form-group">
            <label className="approve-label">Expertise / ความเชี่ยวชาญ</label>
            <select
              name="tags"
              className="approve-input approve-select"
              value={formData.tags}
              onChange={handleChange}
            >
              <option value="">-- เลือกความเชี่ยวชาญ --</option>
              {EXPERTISE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {formData.tags === 'Other' && (
              <input
                type="text"
                name="tagsOther"
                className="approve-input"
                style={{ marginTop: '10px' }}
                placeholder="ระบุความเชี่ยวชาญ"
                value={formData.tagsOther}
                onChange={handleChange}
              />
            )}
          </div>

          <div className="approve-form-group">
            <label className="approve-label">Other Network / เครือข่ายอื่น ๆ</label>
            <input
              type="text"
              name="network"
              className="approve-input"
              placeholder="e.g. Network name"
              value={formData.network}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Organization Detail */}
        <section className="approve-section">
          <h2 className="approve-section-title">Organization Detail</h2>

          <div className="approve-form-group">
            <label className="approve-label">Organization Name (EN)</label>
            <input
              type="text"
              name="project"
              className="approve-input"
              placeholder="e.g. Anthropic"
              value={formData.project}
              onChange={handleChange}
            />
          </div>

          <div className="approve-form-group">
            <label className="approve-label">ชื่อองค์กร (ไทย)</label>
            <input
              type="text"
              name="project_th"
              className="approve-input"
              placeholder="เช่น บริษัท แอนโธรปิก จำกัด"
              value={formData.project_th}
              onChange={handleChange}
            />
          </div>

          <div className="approve-form-group">
            <label className="approve-label">Position (EN)</label>
            <input
              type="text"
              name="position"
              className="approve-input"
              placeholder="e.g. Software Engineer"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

          <div className="approve-form-group">
            <label className="approve-label">ตำแหน่ง (ไทย)</label>
            <input
              type="text"
              name="position_th"
              className="approve-input"
              placeholder="เช่น วิศวกรซอฟต์แวร์"
              value={formData.position_th}
              onChange={handleChange}
            />
          </div>

          <div className="approve-form-group">
            <label className="approve-label">Country / ประเทศ</label>
            <select
              name="country"
              className="approve-input approve-select"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">-- เลือกประเทศ --</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Note */}
        <div className="approve-note-section">
          <h2 className="approve-note-title">Note</h2>
          <textarea
            name="note"
            className="approve-input approve-textarea"
            placeholder="Value"
            value={formData.note}
            onChange={handleChange}
          />
        </div>

        {/* Name Card */}
        <div className="approve-namecard-section">
          <h2 className="approve-note-title">Name Card</h2>
          <div className="approve-namecard-display">
            <span className="approve-namecard-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="#1a1a1a"/>
                <path d="M3 17l5-5 4 4 3-3 6 6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
              </svg>
            </span>
            <span className="approve-namecard-filename">
              {nameCardName || 'ไม่มีไฟล์'}
            </span>
          </div>
        </div>

        {/* Error / Success */}
        {error && <p className="approve-error">{error}</p>}
        {success && <p className="approve-success">บันทึกข้อมูลสำเร็จ! กำลังกลับหน้า Requirements...</p>}

        {/* Bottom action buttons */}
        <div className="approve-action-row">
          <button
            type="button"
            className="approve-upload-button"
            onClick={handleUpload}
            disabled={submitting || deleting}
          >
            {submitting ? 'กำลังบันทึก...' : 'Upload'}
          </button>
          <button
            type="button"
            className="approve-delete-button"
            onClick={handleDelete}
            disabled={submitting || deleting}
          >
            {deleting ? 'กำลังลบ...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Approve;
