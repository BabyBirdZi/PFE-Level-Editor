import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { clearStoredUser, getStoredUser } from "../utils/auth";
import Toast from "../components/Toast";
import { useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = getStoredUser();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePrimaryAction = () => {
    if (isLoggedIn) {
      clearStoredUser();
      showToast("You have been logged out.", "info");
      setTimeout(() => navigate("/"), 300);
      return;
    }

    navigate("/register");
  };

  const handleSecondaryAction = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="forge-page">
      <Toast toast={toast} />

      <header className="forge-header">
        <div className="container forge-header-inner">
          <button className="forge-brand forge-brand-btn" onClick={() => navigate("/")}>
            <div className="forge-logo-box">▣</div>
            <div className="forge-brand-text">LevelForge</div>
          </button>

          <nav className="forge-nav">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#contact">Contact Us</a>
          </nav>

          <div className="forge-header-actions">
            <button className="forge-login-btn" onClick={handleSecondaryAction}>
              {isLoggedIn ? "Dashboard" : "Login"}
            </button>
            <button className="btn-forge btn-green" onClick={handlePrimaryAction}>
              {isLoggedIn ? "Logout" : "Get Started"}
            </button>
          </div>
        </div>
      </header>

      <main className="forge-main">
        <section className="forge-hero">
          <div className="container forge-hero-grid">
            <div className="forge-hero-left">
              <div className="forge-kicker pixel-card-sm">Next-Gen Level Design</div>

              <h1 className="forge-hero-title">
                Forge Your
                <br />
                <span>Digital Realms</span>
              </h1>

              <p className="forge-hero-text">
                LevelForge is a web-based game level editor for designing, managing, and testing
                top-down levels directly from the browser. Create structured level layouts,
                organize interactive objects, and prepare your game data for Unreal Engine integration.
              </p>

              <div className="forge-hero-buttons">
                <button
                  className="btn-forge btn-green"
                  onClick={() => navigate(isLoggedIn ? "/dashboard" : "/register")}
                >
                  {isLoggedIn ? "Open Dashboard" : "Start Creating"}
                </button>
                <button
                  className="btn-forge btn-dark"
                  onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
                >
                  {isLoggedIn ? "Continue Editing" : "View Demo"}
                </button>
              </div>

              <div className="forge-hero-stats">
                <div className="forge-stat">
                  <strong>20×20</strong>
                  <span>Grid Precision</span>
                </div>
                <div className="forge-stat">
                  <strong>AI</strong>
                  <span>Layout Analysis</span>
                </div>
                <div className="forge-stat">
                  <strong>3D</strong>
                  <span>Engine Preview</span>
                </div>
              </div>
            </div>

            <div className="forge-hero-right">
              <div className="forge-hero-visual pixel-card">
                <div className="forge-scene-ground"></div>

                <div className="forge-cube-main"></div>
                <div className="forge-cube-small cube-yellow"></div>
                <div className="forge-cube-small cube-cyan"></div>
                <div className="forge-cube-small cube-light"></div>

                <div className="hero-floating-card hero-top-card pixel-card-sm">
                  <div className="mini-icon yellow-box">▶</div>
                  <div>
                    <h4>Instant Play</h4>
                    <p>Test your creation</p>
                  </div>
                </div>

                <div className="hero-floating-card hero-bottom-card pixel-card-sm">
                  <div className="mini-icon cyan-box">✦</div>
                  <div>
                    <h4>Magic Brush</h4>
                    <p>Auto-tile enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="forge-features forge-anchor-section">
          <div className="container">
            <div className="forge-section-intro">
              <h2 className="section-title">
                Engineered for <span className="text-green">Creativity</span>
              </h2>
              <p className="section-muted">
                LevelForge combines visual level editing, game-oriented workflow design, and structured
                export logic to help designers build interactive levels efficiently and prepare them for gameplay integration.
              </p>
            </div>

            <div className="forge-feature-grid">
              <article className="forge-feature-card pixel-card">
                <div className="feature-box cyan-box">▣</div>
                <h3>Visual Grid Editor</h3>
                <p>Intuitive 20×20 grid system for precise object placement and layout design.</p>
              </article>

              <article className="forge-feature-card pixel-card">
                <div className="feature-box pink-box">✦</div>
                <h3>Smart Brushes</h3>
                <p>Intelligent tools that understand your environment and help you build faster.</p>
              </article>

              <article className="forge-feature-card pixel-card">
                <div className="feature-box green-box">▤</div>
                <h3>Layer Management</h3>
                <p>Organize your levels with multiple layers for terrain, objects, and logic.</p>
              </article>

              <article className="forge-feature-card pixel-card">
                <div className="feature-box yellow-box">✧</div>
                <h3>AI Analysis</h3>
                <p>Get instant feedback on your level’s flow, difficulty, and balance.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="workflow" className="forge-workflow forge-anchor-section">
          <div className="container forge-workflow-grid">
            <div className="forge-workflow-left pixel-card">
              <div className="workflow-steps">
                <div className="workflow-step pixel-card-sm">
                  <span className="step-index green-box">1</span>
                  <p>Define your world’s core structure</p>
                </div>
                <div className="workflow-step pixel-card-sm">
                  <span className="step-index cyan-box">2</span>
                  <p>Place interactive objects and NPCs</p>
                </div>
                <div className="workflow-step pixel-card-sm">
                  <span className="step-index yellow-box">3</span>
                  <p>Analyze and refine with AI tools</p>
                </div>
                <div className="workflow-step pixel-card-sm">
                  <span className="step-index pink-box">4</span>
                  <p>Export directly to your game engine</p>
                </div>
              </div>
            </div>

            <div className="forge-workflow-right">
              <h2 className="section-title">
                From Concept to <span className="text-cyan">Playable</span> Reality
              </h2>
              <p className="section-muted">
                The workflow is designed to support the complete level design process, from grid-based
                layout creation to object placement, analysis, and export. Each level is stored as structured
                JSON data and remains ready for Unreal Engine integration.
              </p>

              <div className="workflow-side-notes">
                <div className="workflow-note">
                  <div className="feature-box green-box">⚒</div>
                  <div>
                    <h4>Built for Builders</h4>
                    <p>Intuitive tools that don’t get in your way. Focus on design, not technical hurdles.</p>
                  </div>
                </div>

                <div className="workflow-note">
                  <div className="feature-box cyan-box">◎</div>
                  <div>
                    <h4>Unreal Export</h4>
                    <p>JSON-based export format optimized specifically for Unreal Engine blueprints and actors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="forge-contact forge-anchor-section">
          <div className="container forge-contact-grid">
            <div className="forge-contact-left">
              <h2 className="section-title">
                Send a <span className="text-yellow">Message</span> to the Forge
              </h2>
              <p className="section-muted">
                Contact us for questions related to the web-based level editor, Unreal Engine
                integration, AI-assisted level analysis, or the overall project architecture.
              </p>

              <div className="contact-info-card pixel-card">
                <div className="feature-box green-box">✉</div>
                <div>
                  <h4>Email Us</h4>
                  <p>contact@levelforge.com</p>
                </div>
              </div>

              <div className="contact-info-card pixel-card">
                <div className="feature-box cyan-box">◎</div>
                <div>
                  <h4>Headquarters</h4>
                  <p>The Pixel Citadel, Block 64</p>
                </div>
              </div>
            </div>

            <div className="forge-contact-right pixel-card">
              <div className="contact-form-grid">
                <div>
                  <label>Your Name</label>
                  <input type="text" placeholder="Enter your name" />
                </div>
                <div>
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" />
                </div>
              </div>

              <div className="contact-form-single">
                <label>Subject</label>
                <input type="text" placeholder="Select a topic" />
              </div>

              <div className="contact-form-single">
                <label>Message</label>
                <textarea placeholder="Tell us about your project..." rows="5"></textarea>
              </div>

              <button className="btn-forge btn-green contact-submit-btn">
                Transmit to Forge
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="forge-footer">
        <div className="container forge-footer-grid">
          <div className="forge-footer-branding">
            <button className="forge-brand forge-brand-btn footer-brand" onClick={() => navigate("/")}>
              <div className="forge-logo-box">▣</div>
              <div className="forge-brand-text">LevelForge</div>
            </button>

            <p>
              Empowering game designers to build immersive fantasy worlds with professional-grade web tools.
            </p>
          </div>

          <div className="forge-footer-nav">
            <h4>Navigation</h4>
            <a href="/">Home</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#contact">Contact Us</a>
          </div>

          <div className="forge-footer-community">
            <h4>Community</h4>
            <div className="community-icons">
              <button type="button" className="pixel-card-sm community-icon" aria-label="YouTube">▶</button>
              <button type="button" className="pixel-card-sm community-icon" aria-label="Instagram">◎</button>
              <button type="button" className="pixel-card-sm community-icon" aria-label="Facebook">f</button>
              <button type="button" className="pixel-card-sm community-icon" aria-label="LinkedIn">in</button>
              <button type="button" className="pixel-card-sm community-icon" aria-label="X">𝕏</button>
            </div>
          </div>
        </div>

        <div className="container forge-footer-bottom">
          <span>© 2026 LevelForge Editor. Master’s End-of-Studies Project.</span>
          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;