import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Managemember.css';

const Managemember = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/people')
      .then(res => res.json())
      .then(data => {
        setMembers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching members:', err);
        setLoading(false);
      });
  }, []);

  const handleEditDetail = (id) => {
    navigate(`/manage-members/${id}`);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: parse CSV and update members list
    alert(`อัปโหลดไฟล์: ${file.name}`);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // TODO: implement bulk save API
      await new Promise(r => setTimeout(r, 600));
      setSuccess(true);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mm-page">
      {/* Header */}
      <div className="mm-header">
        <button className="mm-back-btn" onClick={() => navigate('/admin')}>
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
        <h1 className="mm-title">Manage<br />Memberlist</h1>
      </div>

      <div className="mm-content">
        {/* Table */}
        {loading ? (
          <p className="mm-loading">Loading...</p>
        ) : (
          <div className="mm-table-wrapper">
            <table className="mm-table">
              <thead>
                <tr>
                  <th className="mm-th mm-th-no">No</th>
                  <th className="mm-th mm-th-name">Member Name</th>
                  <th className="mm-th mm-th-manage">Management</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="mm-empty">ยังไม่มีข้อมูลสมาชิก</td>
                  </tr>
                ) : (
                  members.map((m, idx) => (
                    <tr key={m.id ?? idx} className="mm-tr">
                      <td className="mm-td mm-td-no">{idx + 1}</td>
                      <td className="mm-td mm-td-name">{m.name || '-'}</td>
                      <td className="mm-td mm-td-manage">
                        <button
                          className="mm-edit-btn"
                          onClick={() => handleEditDetail(m.id)}
                        >
                          Edit Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add more data */}
        <p className="mm-add-label">Add more data</p>

        <button
          className="mm-csv-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7C3 5.9 3.9 5 5 5H14L19 10V19C19 20.1 18.1 21 17 21H5C3.9 21 3 20.1 3 19V7Z"
              stroke="#e53935" strokeWidth="2" fill="none"
            />
            <path d="M14 5V10H19" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 15H15M12 12V18" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Upload CSV File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleCsvUpload}
        />

        {error && <p className="mm-error">{error}</p>}
        {success && <p className="mm-success">บันทึกสำเร็จ!</p>}

        <button className="mm-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'กำลังบันทึก...' : 'SAVE'}
        </button>
      </div>
    </div>
  );
};

export default Managemember;
