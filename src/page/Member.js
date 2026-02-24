import React, { useState, useEffect } from 'react'; // 1. เพิ่ม useState และ useEffect
import { useNavigate, useParams } from 'react-router-dom';
import './Member.css';

const Member = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ id จาก URL เช่น /member/1
  
  // 2. สร้าง State สำหรับเก็บข้อมูลสมาชิกที่ดึงมาได้
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. ดึงข้อมูลจาก API เมื่อ Component โหลด
  useEffect(() => {
    fetch(`http://localhost:3000/api/people/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Member not found');
        return response.json();
      })
      .then(data => {
        setMember(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [id]); // ทำงานใหม่ทุกครั้งที่ id เปลี่ยน

  const handleBack = () => {
    navigate('/');
  };

  // 4. ถ้ากำลังโหลด หรือไม่พบข้อมูล ให้แสดงข้อความแจ้ง
  if (loading) return <div className="loading">Loading...</div>;
  if (!member) return <div className="error">Member not found!</div>;

  return (
    <div className="member-page">
      {/* Header */}
      <div className="member-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="member-header-title">Member</h1>
      </div>

      <div className="member-content">
        <div className="profile-avatar">
           {/* SVG เหมือนเดิม */}
        </div>

        {/* Personal Detail - นำข้อมูลจาก member มาใช้ */}
        <section className="detail-section">
          <h2 className="section-title">Personal Detail</h2>
          
          <div className="form-group">
            <label className="form-label">Name - Surname (EN)</label>
            <input 
              type="text" 
              className="form-input" 
              value={member.name} // เปลี่ยนจาก placeholder เป็น value
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">ชื่อ - นามสกุล (ไทย)</label>
            <input 
              type="text" 
              className="form-input" 
              value={member.name_th}
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">National / สัญชาติ</label>
            <input 
              type="text" 
              className="form-input" 
              value={member.location} 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email / อีเมล</label>
            <input 
              type="email" 
              className="form-input" 
              value={member.email} 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expertise / ความเชี่ยวชาญ</label>
            <div className="tag-container">
              {/* วนลูปแสดง Tags จริงจาก API */}
              {member.tags.map((tag, index) => (
                <span key={index} className={`tag ${index === 0 ? 'tag-primary' : 'tag-secondary'}`}>
                  {tag.label}
                </span>
              ))}
            </div>
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
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">ชื่อองค์กร (ไทย)</label>
            <input
              type="text"
              className="form-input"
              value={member.project_th || ''}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">Position (EN)</label>
            <input
              type="text"
              className="form-input"
              value={member.position || ''}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">ตำแหน่ง (ไทย)</label>
            <input
              type="text"
              className="form-input"
              value={member.position_th || ''}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">Country / ประเทศ</label>
            <input
              type="text"
              className="form-input"
              value={member.country || ''}
              readOnly
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Member;