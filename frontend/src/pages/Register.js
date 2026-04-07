import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import Toast from "../components/Toast";

function Register() {
  const [username, setUsername] = useState("");
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

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.length < 3) {
      newErrors.username = "Username must contain at least 3 characters.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    try {
      await API.post("/auth/register", {
        username,
        email,
        password,
      });

      showToast("Account created successfully.", "success");

      setTimeout(() => {
        navigate("/login");
      }, 400);
    } catch (err) {
      showToast("Registration failed. Please try again.", "error");
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

        <h1 className="auth-title">FORGE ACCOUNT</h1>
        <p className="auth-subtitle">JOIN THE NEXT GENERATION OF DESIGNERS</p>

        <form onSubmit={handleRegister} className="auth-form" noValidate>
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && <p className="field-error">{errors.username}</p>}
          </div>

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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-forge btn-green auth-submit-btn">
            Create Account
          </button>
        </form>

        <div className="auth-divider"></div>

        <p className="auth-switch-text">Already have an account?</p>
        <button className="auth-link-btn auth-accent-link" onClick={() => navigate("/login")}>
          Enter the Forge
        </button>

        <button className="auth-link-btn auth-back-link" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Register;