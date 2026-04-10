import { API_URL } from '../../config';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authHeaders } from '../../utils/auth';
import './Requirement.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const Requirement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // location.key เปลี่ยนทุกครั้งที่ navigate มาหน้านี้
  // → force re-fetch เสมอ ไม่ใช้ข้อมูลเก่า
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/admin/submissions`, { headers: authHeaders(false) })
      .then((res) => res.json())
      .then((data) => {
        // แสดงเฉพาะ pending (status === 'pending' หรือ ไม่มี status field)
        const pending = Array.isArray(data)
          ? data.filter((m) => !m.status || m.status === 'pending')
          : [];
        setMembers(pending);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching members:', err);
        setLoading(false);
      });
  }, [location.key]);

  const handleBack = () => navigate('/admin');

  const handleEdit = (id) => navigate(`/approve/${id}`);

  return (
    <div className="requirement-page">
      {/* Header */}
      <div className="requirement-header">
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
        <h1 className="requirement-header-title">Requirements</h1>
      </div>

      <div className="requirement-content">
        {loading ? (
          <p className="requirement-loading">Loading...</p>
        ) : members.length === 0 ? (
          <p className="requirement-empty">ยังไม่มีข้อมูลสมาชิก</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="req-card">
              <div className="req-card-header">
                <span>Submit by {member.submitted_by || member.name}</span>
                {member.created_at && (
                  <span className="req-card-date">{formatDate(member.created_at)}</span>
                )}
              </div>
              <ul className="req-card-list">
                <li><span className="req-label">Name:</span> {member.name || '-'}</li>
                <li><span className="req-label">Org:</span> {member.project || '-'}</li>
                <li><span className="req-label">Country:</span> {member.country || '-'}</li>
              </ul>
              <div className="req-card-footer">
                <button
                  className="req-edit-button"
                  onClick={() => handleEdit(member.id)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Requirement;
