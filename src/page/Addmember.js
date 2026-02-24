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
    project: '',
    project_th: '',
    position: '',
    position_th: '',
    country: '',
  });

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
    setSubmitting(true);
    setError(null);

    const tagLabel = formData.tags === 'Other' ? formData.tagsOther : formData.tags;
    const tagsArray = tagLabel ? [{ label: tagLabel }] : [];

    const payload = {
      name: formData.name,
      name_th: formData.name_th,
      location: formData.location,
      email: formData.email,
      tags: tagsArray,
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

      if (!response.ok) throw new Error('Failed to add member');

      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message);
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
        {/* Avatar placeholder */}
        <div className="profile-avatar">
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
        </div>

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
                required
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
                required
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
                  required
                />
              )}
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
