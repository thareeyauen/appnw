import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addmember.css';

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

const Addmember = () => {
  const navigate = useNavigate();

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
  const [nameCard, setNameCard] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // ตรวจสอบว่ามีข้อมูลอย่างน้อย 1 ช่อง หรือมีไฟล์ Name Card
    const hasAnyField = Object.entries(formData).some(
      ([key, val]) => key !== 'tagsOther' && String(val).trim() !== ''
    );
    if (!hasAnyField && !nameCard) {
      setError('กรุณากรอกข้อมูลอย่างน้อย 1 ช่อง หรือเพิ่ม Name Card');
      return;
    }

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
    };

    try {
      const response = await fetch('http://localhost:3000/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const STATUS_MESSAGES = {
          400: 'ข้อมูลไม่ถูกต้อง (400) — กรุณาตรวจสอบข้อมูลที่กรอกอีกครั้ง',
          401: 'ไม่มีสิทธิ์เข้าถึง (401) — กรุณาล็อกอินใหม่',
          403: 'ถูกปฏิเสธการเข้าถึง (403) — คุณไม่มีสิทธิ์ดำเนินการนี้',
          404: 'ไม่พบ API endpoint (404) — กรุณาติดต่อผู้ดูแลระบบ',
          409: 'ข้อมูลซ้ำ (409) — อีเมลหรือข้อมูลนี้มีอยู่ในระบบแล้ว',
          422: 'ข้อมูลไม่ผ่านการตรวจสอบ (422) — กรุณาตรวจสอบรูปแบบข้อมูล',
          500: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด (500) — กรุณาลองใหม่อีกครั้งในภายหลัง',
          502: 'เซิร์ฟเวอร์ไม่ตอบสนอง (502) — กรุณาลองใหม่อีกครั้ง',
          503: 'บริการไม่พร้อมใช้งาน (503) — เซิร์ฟเวอร์อาจกำลังบำรุงรักษา',
        };
        const message = STATUS_MESSAGES[response.status]
          || `เกิดข้อผิดพลาด (${response.status}) — ไม่สามารถเพิ่มสมาชิกได้`;
        throw new Error(message);
      }

      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ — กรุณาตรวจสอบว่า Backend กำลังทำงานอยู่ (http://localhost:3000)');
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="addmember-page">
      {/* Header */}
      <div className="addmember-header">
        <button className="back-button" onClick={handleBack} type="button">
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
        <h1 className="addmember-header-title">Add New Member</h1>
      </div>

      <div className="addmember-content">
        {/* Avatar — คลิกเพื่ออัปโหลดรูป */}
        <label className="avatar-upload-label">
          <div className="profile-avatar">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="avatar-preview" />
            ) : (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <div className="avatar-overlay">
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
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setProfileImage(URL.createObjectURL(file));
            }}
          />
        </label>

        <form onSubmit={handleSubmit}>
          {/* Personal Detail */}
          <section className="detail-section">
            <h2 className="section-title">Personal Detail</h2>

            <div className="form-group">
              <label className="form-label">Name - Surname (EN)</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. John Smith"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ชื่อ - นามสกุล (ไทย)</label>
              <input
                type="text"
                name="name_th"
                className="form-input"
                placeholder="เช่น จอห์น สมิธ"
                value={formData.name_th}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">National / สัญชาติ</label>
              <select
                name="location"
                className="form-input form-select"
                value={formData.location}
                onChange={handleChange}
              >
                <option value="">-- เลือกสัญชาติ --</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email / อีเมล</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expertise / ความเชี่ยวชาญ</label>
              <select
                name="tags"
                className="form-input form-select"
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
                  className="form-input"
                  style={{ marginTop: '10px' }}
                  placeholder="ระบุความเชี่ยวชาญของคุณ"
                  value={formData.tagsOther}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Other Network / เครือข่ายอื่น ๆ</label>
              <input
                type="text"
                name="network"
                className="form-input"
                placeholder="e.g. Network name"
                value={formData.network}
                onChange={handleChange}
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
                name="project"
                className="form-input"
                placeholder="e.g. Anthropic"
                value={formData.project}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ชื่อองค์กร (ไทย)</label>
              <input
                type="text"
                name="project_th"
                className="form-input"
                placeholder="เช่น บริษัท แอนโธรปิก จำกัด"
                value={formData.project_th}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Position (EN)</label>
              <input
                type="text"
                name="position"
                className="form-input"
                placeholder="e.g. Software Engineer"
                value={formData.position}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ตำแหน่ง (ไทย)</label>
              <input
                type="text"
                name="position_th"
                className="form-input"
                placeholder="เช่น วิศวกรซอฟต์แวร์"
                value={formData.position_th}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country / ประเทศ</label>
              <select
                name="country"
                className="form-input form-select"
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
          <div className="note-section">
            <h2 className="note-title">Note</h2>
            <textarea
              name="note"
              className="form-input note-textarea"
              placeholder="Value"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          {/* Add Name Card */}
          <div className="name-card-row">
            <label className="name-card-button">
              <span className="name-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#1a1a1a"/>
                  <path d="M3 17l5-5 4 4 3-3 6 6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
                </svg>
              </span>
              <span className="name-card-label">
                {nameCard ? nameCard.name : 'Add Name Card'}
              </span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setNameCard(e.target.files[0] || null)}
              />
            </label>
          </div>

          {/* Error / Success */}
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">เพิ่มสมาชิกสำเร็จ! กำลังกลับหน้าหลัก...</p>}

          {/* Submit */}
          <button
            type="submit"
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'กำลังบันทึก...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addmember;
