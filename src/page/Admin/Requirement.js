import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/people')
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching members:', err);
        setLoading(false);
      });
  }, []);

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
                <span>Submit by {member.name}</span>
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
