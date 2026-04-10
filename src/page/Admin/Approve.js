import { API_URL } from '../../config';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authHeaders, handleUnauthorized } from '../../utils/auth';
import Cropper from 'react-easy-crop';
import './Approve.css';


const TAG_COLORS = {
  'Open Data':            { background: '#7BAE8E', color: 'white' },
  'Public Procurement':   { background: '#D97757', color: 'white' },
  'WhistleBlower':       { background: '#D4A96A', color: 'white' },
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

  const [expertiseOptions, setExpertiseOptions] = useState([]);
  const [expertiseDescMap, setExpertiseDescMap] = useState({});
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const [profileImage, setProfileImage] = useState(null);
  const [nameCardName, setNameCardName] = useState('');
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/expertise`, { headers: authHeaders(false) })
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
    fetch(`${API_URL}/api/admin/submissions/${id}`, { headers: authHeaders(false) })
      .then((res) => { handleUnauthorized(res.status);
        console.log('[Approve] HTTP status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('[Approve] API response:', data);
        setMember(data);
        if (data.avatar) setProfileImage(
          data.avatar.startsWith('http') ? data.avatar : `${API_URL}${data.avatar}`
        );
        if (data.nameCard) setNameCardName(
          data.nameCard.startsWith('http') ? data.nameCard : `${API_URL}${data.nameCard}`
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching member:', err);
        setLoading(false);
      });
  }, [id]);

  // Process tags after both member and expertiseOptions are loaded
  useEffect(() => {
    if (!member) return;
    const allTags = Array.isArray(member.tags) ? member.tags
      : typeof member.tags === 'string' && member.tags ? [member.tags] : [];
    const allLabels = allTags.map(t => (typeof t === 'string' ? t : t.label || ''));
    const selectedKnown = allLabels.filter(l => expertiseOptions.includes(l));
    const customTags = allTags.filter(t => {
      const l = typeof t === 'string' ? t : t.label || '';
      return l && !expertiseOptions.includes(l);
    });
    const customLabels = customTags.map(t => typeof t === 'string' ? t : t.label || '');
    const customDesc = customTags.map(t => typeof t === 'object' ? (t.description || '') : '').filter(Boolean).join(', ');
    setFormData({
      name: member.name || '',
      name_th: member.name_th || '',
      national: member.national || '',
      email: member.email || '',
      phone: member.phone || '',
      tags: [...selectedKnown, ...(customLabels.length > 0 ? ['Other'] : [])],
      tagsOther: customLabels.join(', '),
      tagsOtherDesc: customDesc,
      network: member.network || '',
      project: member.project || '',
      project_th: member.project_th || '',
      position: member.position || '',
      position_th: member.position_th || '',
      country: member.country || '',
      note: member.note || '',
    });
  }, [member, expertiseOptions]);

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
      setCropImage(null);
    }, 'image/jpeg', 0.92);
  };

  const handleUpload = async () => {
    setError(null);
    setSubmitting(true);

    const tagsArray = formData.tags.flatMap(label =>
      label === 'Other'
        ? (formData.tagsOther.trim() ? [{ label: formData.tagsOther.trim(), description: formData.tagsOtherDesc.trim() }] : [])
        : [{ label }]
    );

    const payload = {
      name: formData.name,
      name_th: formData.name_th,
      national: formData.national,
      email: formData.email,
      phone: formData.phone,
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
      const response = await fetch(`${API_URL}/api/admin/submissions/${id}/approve`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`เกิดข้อผิดพลาด (${response.status})`);

      const result = await response.json();
      const newPersonId = result.data?.id || result.data?._id;

      // Only re-upload if admin selected a new image (blob: URL), not the original submission avatar
      if (newPersonId && profileImage && profileImage.startsWith('blob:')) {
        const imgRes = await fetch(profileImage);
        const blob = await imgRes.blob();
        const form = new FormData();
        form.append('avatar', blob, 'avatar.jpg');
        await fetch(`${API_URL}/api/people/${newPersonId}/avatar`, {
          method: 'POST',
          headers: { Authorization: authHeaders().Authorization },
          body: form,
        }).catch(() => {});
      }

      if (formData.tagsOther.trim()) {
        fetch(`${API_URL}/api/expertise`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ label: formData.tagsOther.trim(), description: formData.tagsOtherDesc.trim() }),
        }).catch(() => {});
      }

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
      const response = await fetch(`${API_URL}/api/admin/submissions/${id}/reject`, {
        method: 'PATCH',
        headers: authHeaders(false),
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
              if (!file) return;
              setCropImage(URL.createObjectURL(file));
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              e.target.value = '';
            }}
          />
        </label>
        <p className="approve-submit-info">
          Submit by {member?.submitted_by || '-'}&nbsp;-&nbsp;{formatDate(member?.created_at)}
        </p>

        <div className="approve-sections-grid">
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
              name="national"
              className="approve-input approve-select"
              value={formData.national}
              onChange={handleChange}
            >
              <option value="">-- เลือกสัญชาติ --</option>
              {NATIONALITY_OPTIONS.map((c) => (
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
            <label className="approve-label">Phone / เบอร์โทรศัพท์</label>
            <input
              type="tel"
              name="phone"
              className="approve-input"
              placeholder="e.g. +66 81 234 5678"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="approve-form-group">
            <label className="approve-label">Expertise / ความเชี่ยวชาญ</label>
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
                  className="approve-input"
                  placeholder="ระบุความเชี่ยวชาญ"
                  value={formData.tagsOther}
                  onChange={handleChange}
                />
                <textarea
                  name="tagsOtherDesc"
                  className="approve-input other-expertise-desc"
                  placeholder="คำอธิบายเพิ่มเติม (ไม่บังคับ)"
                  value={formData.tagsOtherDesc}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
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
        </div>{/* end approve-sections-grid */}

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
            {nameCardName ? (
              <a
                className="approve-namecard-filename approve-namecard-link"
                href={nameCardName}
                target="_blank"
                rel="noopener noreferrer"
              >
                {nameCardName.split('/').pop()}
              </a>
            ) : (
              <span className="approve-namecard-filename">ไม่มีไฟล์</span>
            )}
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

export default Approve;
