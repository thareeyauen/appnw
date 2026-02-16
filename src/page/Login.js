import "./Login.css";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // (ภายหลังค่อยใส่ logic ตรวจ user/password)
    navigate("/");
  };

  return (
            <div className="login-container">
      <h1 className="title">
        Network <br /> App
      </h1>

      <div className="form-group">
        <label>Email</label>
        <input type="text" placeholder="Value" />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="Value" />
      </div>

      <button className="sign-in-btn" onClick={handleLogin}>
        Sign In
      </button>
    </div>
  );
}

export default Login;
