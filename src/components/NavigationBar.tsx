import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTheme } from "./Theme";
export function Mark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M7 4v21h20M15 4v13h12"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default function NavigationBar() {
  const { choice, setChoice } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="wordmark" aria-label="LidlDev home">
          <Mark />
          <span>
            lidldev<span className="wordmark-dot">.</span>
          </span>
        </Link>
        <div className="header-controls">
          <label className="theme-control">
            <span className="sr-only">Color theme</span>
            <select
              aria-label="Color theme"
              value={choice}
              onChange={(e) =>
                setChoice(e.target.value as "system" | "light" | "dark")
              }
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <button
            ref={menuButton}
            className="menu-toggle icon-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={open ? "main-nav is-open" : "main-nav"}
        >
          <Link to="/#work">Work</Link>
          <Link to="/#about">About</Link>
          <Link className="nav-contact" to="/#contact">
            Let’s talk <ArrowUpRight size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
