import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Manageuser.css';

const Manageuser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [validTypes, setValidTypes] = useState(null);
  const [loading, setLoading] = useState(true);
  const MOCK_USERS = [
    { id: 1, name: 'Saranchanok', email: 'saranchanok@hand.co.th', type: 'User' },
    { id: 2, name: 'Admin01',     email: 'admin01@hand.co.th',     type: 'Admin' },
  ];

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/api/users').then(r => r.json()).catch(() => null),
      fetch('http://localhost:3000/api/user-types').then(r => r.json()).catch(() => null),
    ]).then(([userData, typeData]) => {
      setUsers(Array.isArray(userData) && userData.length > 0 ? userData : MOCK_USERS);
      if (Array.isArray(typeData)) {
        setValidTypes(new Set(typeData.map(t => t.label)));
      }
      setLoading(false);
    });
  }, []);

  const resolveType = (type) => {
    if (!type) return '-';
    if (validTypes === null) return type;
    return validTypes.has(type) ? type : '-';
  };

  const handleEditDetail = (id) => {
    navigate(`/manage-users/${id}`);
  };

return (
    <div className="mu-page">
      {/* Header */}
      <div className="mu-header">
        <button className="mu-back-btn" onClick={() => navigate('/admin')}>
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
        <h1 className="mu-title">Manage<br />Userlist</h1>
      </div>

      <div className="mu-content">
        {/* Table */}
        {loading ? (
          <p className="mu-loading">Loading...</p>
        ) : (
          <div className="mu-table-wrapper">
            <table className="mu-table">
              <thead>
                <tr>
                  <th className="mu-th mu-th-no">No.</th>
                  <th className="mu-th mu-th-name">Username</th>
                  <th className="mu-th mu-th-type">User Type</th>
                  <th className="mu-th mu-th-manage">Management</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="mu-empty">ยังไม่มีข้อมูล User</td>
                  </tr>
                ) : (
                  users.map((u, idx) => (
                    <tr key={u.id ?? idx} className="mu-tr">
                      <td className="mu-td mu-td-no">{idx + 1}</td>
                      <td className="mu-td mu-td-name">{u.name || u.username || '-'}</td>
                      <td className="mu-td mu-td-type">{resolveType(u.type || u.role)}</td>
                      <td className="mu-td mu-td-manage">
                        <button
                          className="mu-edit-btn"
                          onClick={() => handleEditDetail(u.id)}
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


        <button className="mu-new-btn" onClick={() => navigate('/manage-users/new')}>
          + New User
        </button>
      </div>
    </div>
  );
};

export default Manageuser;
