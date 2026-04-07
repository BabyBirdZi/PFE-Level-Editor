import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import Toast from "../components/Toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters.";
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("username", res.data.username || email.split("@")[0]);

      showToast("Login successful.", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 400);
    } catch (err) {
      showToast("Login failed. Please check your credentials.", "error");
    }
  };

  return (
    <div className="auth-page">
      <Toast toast={toast} />

      <div className="auth-bg-glow auth-glow-left"></div>
      <div className="auth-bg-glow auth-glow-right"></div>

      <div className="auth-card pixel-card">
        <div className="auth-logo-wrap">
          <button className="forge-brand-btn" onClick={() => navigate("/")}>
            <div className="forge-logo-box">▣</div>
          </button>
        </div>

        <h1 className="auth-title">WELCOME BACK</h1>
        <p className="auth-subtitle">CONTINUE YOUR FORGING JOURNEY</p>

        <form onSubmit={handleLogin} className="auth-form" noValidate>
          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-forge btn-green auth-submit-btn">
            Enter the Forge
          </button>
        </form>

        <div className="auth-divider"></div>

        <p className="auth-switch-text">Don’t have an account?</p>
        <button className="auth-link-btn auth-accent-link" onClick={() => navigate("/register")}>
          Forge New Identity
        </button>

        <button className="auth-link-btn auth-back-link" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;