import { API_URL } from '../config';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authHeaders, getUser } from '../utils/auth';
import Cropper from 'react-easy-crop';
import './Addmember.css';

const TAG_COLORS = {
  'Open Data':            { background: '#7BAE8E', color: 'white' },
  'Public Procurement':   { background: '#D97757', color: 'white' },
  'WhistleBlower':        { background: '#D4A96A', color: 'white' },
  'Business integrity':   { background: '#7A9BB5', color: 'white' },
};
const getTagStyle = (label) => TAG_COLORS[label] || { background: '#cab8d9', color: '#1a1a1a' };

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

const NATIONALITY_OPTIONS = [
  'Afghan', 'Albanian', 'Algerian', 'American', 'Argentine', 'Armenian',
  'Australian', 'Austrian', 'Azerbaijani', 'Bahraini', 'Bangladeshi',
  'Belarusian', 'Belgian', 'Bolivian', 'Bosnian', 'Brazilian', 'British',
  'Bulgarian', 'Cambodian', 'Cameroonian', 'Canadian', 'Chilean', 'Chinese',
  'Colombian', 'Croatian', 'Czech', 'Danish', 'Dutch', 'Ecuadorian', 'Egyptian',
  'Emirati', 'Estonian', 'Ethiopian', 'Filipino', 'Finnish', 'French',
  'Georgian', 'German', 'Ghanaian', 'Greek', 'Hungarian', 'Indian',
  'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Japanese',
  'Jordanian', 'Kazakhstani', 'Kenyan', 'Kuwaiti', 'Kyrgyz', 'Lao', 'Latvian',
  'Lebanese', 'Lithuanian', 'Luxembourgish', 'Malaysian', 'Mexican',
  'Mongolian', 'Moroccan', 'Burmese', 'Nepali', 'New Zealander', 'Nigerian',
  'North Korean', 'Norwegian', 'Omani', 'Pakistani', 'Palestinian', 'Peruvian',
  'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Saudi Arabian',
  'Serbian', 'Singaporean', 'Slovak', 'Slovenian', 'South African',
  'South Korean', 'Spanish', 'Sri Lankan', 'Swedish', 'Swiss', 'Syrian',
  'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Tunisian', 'Turkish',
  'Turkmen', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbek', 'Venezuelan',
  'Vietnamese', 'Yemeni', 'Zimbabwean',
];

const Addmember = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    name_th: '',
    national: '',
    email: '',
    phone: '',
    tags: [],
    tagsOther: '',
    tagsOtherDesc: '',
    network: '',
    project: '',
    project_th: '',
    position: '',
    position_th: '',
    country: '',
    note: '',
  });

  const [expertiseOptions, setExpertiseOptions] = useState([]);
  const [expertiseDescMap, setExpertiseDescMap] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [profileBlob, setProfileBlob] = useState(null);
  const [nameCard, setNameCard] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/expertise`)
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

  const handleBack = () => {
    navigate('/');
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleCropConfirm = async () => {
    const img = new Image();
    img.src = cropImage;
    await new Promise(r => { img.onload = r; });
    const canvas = document.createElement('canvas');
    const { x, y, width, height } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
    canvas.toBlob(blob => {
      setProfileImage(URL.createObjectURL(blob));
      setProfileBlob(blob);
      setCropImage(null);
    }, 'image/jpeg', 0.92);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (opt) => {
    setFormData(prev => {
      const tags = prev.tags.includes(opt)
        ? prev.tags.filter(t => t !== opt)
        : [...prev.tags, opt];
      return { ...prev, tags };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // ตรวจสอบว่ามีข้อมูลอย่างน้อย 1 ช่อง หรือมีไฟล์ Name Card
    const hasAnyField = Object.entries(formData).some(
      ([key, val]) => key !== 'tagsOther' && key !== 'tagsOtherDesc' && String(val).trim() !== ''
    );
    if (!hasAnyField && !nameCard) {
      setError('กรุณากรอกข้อมูลอย่างน้อย 1 ช่อง หรือเพิ่ม Name Card');
      return;
    }

    setSubmitting(true);

    const tagsArray = formData.tags.flatMap(label =>
      label === 'Other'
        ? (formData.tagsOther.trim() ? [{ label: formData.tagsOther.trim(), description: formData.tagsOtherDesc.trim() }] : [])
        : [{ label }]
    );

    const body = new FormData();
    body.append('name', formData.name);
    body.append('name_th', formData.name_th);
    body.append('national', formData.national);
    body.append('email', formData.email);
    body.append('phone', formData.phone);
    body.append('tags', JSON.stringify(tagsArray));
    body.append('network', formData.network);
    body.append('project', formData.project);
    body.append('project_th', formData.project_th);
    body.append('position', formData.position);
    body.append('position_th', formData.position_th);
    body.append('country', formData.country);
    body.append('note', formData.note);
    if (profileBlob) body.append('avatar', profileBlob, 'avatar.jpg');

    try {
      const response = await fetch(`${API_URL}/api/submissions`, {
        method: 'POST',
        headers: authHeaders(false),
        body,
      });

      if (!response.ok) {
        const STATUS_MESSAGES = {
          401: 'ไม่มีสิทธิ์เข้าถึง (401) — กรุณาล็อกอินใหม่',
          403: 'ถูกปฏิเสธการเข้าถึง (403) — คุณไม่มีสิทธิ์ดำเนินการนี้',
          404: 'ไม่พบ API endpoint (404) — กรุณาติดต่อผู้ดูแลระบบ',
          409: 'ข้อมูลซ้ำ (409) — อีเมลหรือข้อมูลนี้มีอยู่ในระบบแล้ว',
          422: 'ข้อมูลไม่ผ่านการตรวจสอบ (422) — กรุณาตรวจสอบรูปแบบข้อมูล',
          500: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด (500) — กรุณาลองใหม่อีกครั้งในภายหลัง',
          502: 'เซิร์ฟเวอร์ไม่ตอบสนอง (502) — กรุณาลองใหม่อีกครั้ง',
          503: 'บริการไม่พร้อมใช้งาน (503) — เซิร์ฟเวอร์อาจกำลังบำรุงรักษา',
        };

        if (response.status === 400) {
          let detail = '';
          try {
            const body = await response.json();
            detail = body.message || body.error || body.detail
              || (Array.isArray(body.errors)
                ? body.errors.map((e) => e.msg || e.message || JSON.stringify(e)).join(', ')
                : '');
          } catch (_) {}
          const base = 'ข้อมูลไม่ถูกต้อง (400) — กรุณาตรวจสอบข้อมูลที่กรอกอีกครั้ง';
          throw new Error(detail ? `${base}\nสาเหตุ: ${detail}` : base);
        }

        const message = STATUS_MESSAGES[response.status]
          || `เกิดข้อผิดพลาด (${response.status}) — ไม่สามารถเพิ่มสมาชิกได้`;
        throw new Error(message);
      }

      // Parse response to get created submission ID
      let created = {};
      try { created = await response.json(); } catch (_) {}

      // รองรับหลายรูปแบบ: { id }, { _id }, { data: { id } }, { submission: { id } }
      const submissionId =
        created.id ??
        created._id ??
        created.data?.id ??
        created.data?._id ??
        created.submission?.id ??
        created.submission?._id ??
        null;

      // Upload namecard as separate request after getting submission ID
      if (submissionId && nameCard) {
        const ncForm = new FormData();
        ncForm.append('nameCard', nameCard, nameCard.name);
        await fetch(`${API_URL}/api/submissions/${submissionId}/namecard`, {
          method: 'POST',
          headers: authHeaders(false),
          body: ncForm,
        }).catch(() => {});
      }

      // Save submission to localStorage so Profile can show it (per-user key)
      const lsKey  = `mySubmissions_${getUser()?.email || 'guest'}`;
      const myList = JSON.parse(localStorage.getItem(lsKey) || '[]');
      myList.unshift({
        id: submissionId !== null ? String(submissionId) : String(Date.now()),
        name: formData.name,
        project: formData.project,
        country: formData.country,
        national: formData.national,
        email: formData.email,
        tags: tagsArray,
        created_at: created.created_at || new Date().toISOString(),
        status: 'pending',
      });
      localStorage.setItem(lsKey, JSON.stringify(myList));

      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ — กรุณาตรวจสอบว่า Backend กำลังทำงานอยู่ (${API_URL})');
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
              if (!file) return;
              setCropImage(URL.createObjectURL(file));
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              e.target.value = '';
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
                name="national"
                className="form-input form-select"
                value={formData.national}
                onChange={handleChange}
              >
                <option value="">-- เลือกสัญชาติ --</option>
                {NATIONALITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email / อีเมล</label>
              <input
                type="text"
                name="email"
                className="form-input"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone / เบอร์โทรศัพท์</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="e.g. +66 81 234 5678"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expertise / ความเชี่ยวชาญ</label>
              <div className="expertise-pills">
                {expertiseOptions.map((opt) => (
                  <div key={opt} className="expertise-pill-wrap">
                    <button
                      type="button"
                      className={`expertise-pill${formData.tags.includes(opt) ? ' expertise-pill--active' : ''}`}
                      style={formData.tags.includes(opt) ? getTagStyle(opt) : {}}
                      onClick={() => toggleTag(opt)}
                    >
                      {opt}
                    </button>
                    {expertiseDescMap[opt] && <span className="expertise-pill-tooltip">{expertiseDescMap[opt]}</span>}
                  </div>
                ))}
                <button
                  type="button"
                  className={`expertise-pill${formData.tags.includes('Other') ? ' expertise-pill--active' : ''}`}
                  style={formData.tags.includes('Other') ? { background: '#cab8d9', color: '#1a1a1a', borderColor: 'transparent' } : {}}
                  onClick={() => toggleTag('Other')}
                >
                  Other
                </button>
              </div>
              {formData.tags.includes('Other') && (
                <div className="other-expertise-fields">
                  <input
                    type="text"
                    name="tagsOther"
                    className="form-input"
                    placeholder="ระบุความเชี่ยวชาญของคุณ"
                    value={formData.tagsOther}
                    onChange={handleChange}
                  />
                  <textarea
                    name="tagsOtherDesc"
                    className="form-input other-expertise-desc"
                    placeholder="คำอธิบายเพิ่มเติม"
                    value={formData.tagsOtherDesc}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
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

      {/* Avatar Crop Modal */}
      {cropImage && (
        <div className="em-modal-overlay">
          <div className="em-crop-modal">
            <p className="em-modal-text">ปรับรูปโปรไฟล์</p>
            <div className="em-crop-container">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="em-crop-zoom">
              <span>-</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="em-crop-slider"
              />
              <span>+</span>
            </div>
            <div className="em-modal-actions">
              <button type="button" className="em-modal-cancel" onClick={() => setCropImage(null)}>
                ยกเลิก
              </button>
              <button type="button" className="em-modal-confirm em-modal-confirm-save" onClick={handleCropConfirm}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addmember;
