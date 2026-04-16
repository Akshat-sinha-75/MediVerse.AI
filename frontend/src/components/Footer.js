import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">MEDIVERSE.AI</span>
            <p className="footer-tagline">
              All healthcare intelligence. One unified AI platform.
            </p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Platform</h4>
              <a href="#services">Services</a>
              <a href="/auth/login">Dashboard</a>
              <a href="/auth/signup">Get Started</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers" id="careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MediVerse.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
