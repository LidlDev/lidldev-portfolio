import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link to="/" className="footer-wordmark">
          lidldev<span>.</span>
        </Link>
        <p>
          Made with curiosity.
          <br />
          Built with intent.
        </p>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Harry · LidlDev</span>
        <div>
          <Link to="/support">Support</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href="https://github.com/LidlDev" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
        <Link to="/#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
