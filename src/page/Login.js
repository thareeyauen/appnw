import { API_URL } from '../config';
import { useState } from 'react';
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { setAuth } from '../utils/auth';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('กรุณากรอก Email และ Password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Email หรือ Password ไม่ถูกต้อง');
        return;
      }
      setAuth(data.token, data.user);
      if (data.user.type === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="title">
          Network <br /> App
        </h1>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="sign-in-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

export default Login;
