import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../utils/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:3000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        return;
      }
      setAuth(data.token, data.user);
      navigate(data.user.type === 'Admin' ? '/admin' : '/');
    } catch {
      setError('ไม่สามารถเชื่อมต่อ server ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="title">
          Network <br /> App
        </h1>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Value"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Value"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: '#c62828', fontSize: '13px', margin: '0 0 8px 0' }}>
              {error}
            </p>
          )}

          <button className="sign-in-btn" type="submit" disabled={loading}>
            {loading ? '...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
