"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import '../subpage.css';

export default function Portfolio() {
  useEffect(() => {
    // Add inner-page class for subpage styling
    document.body.classList.add('inner-page');
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

    // Load scripts dynamically
    const script = document.createElement('script');
    script.src = '/js/app.js?v=2';
    document.body.appendChild(script);

    const navScript = document.createElement('script');
    navScript.src = '/js/mobile-nav.js';
    document.body.appendChild(navScript);

    return () => {
      document.body.classList.remove('inner-page');
      document.body.removeChild(script);
      document.body.removeChild(navScript);
    };
  }, []);

  return (
    <>
      <div className="site-noise" aria-hidden="true"></div>
      <header className="site-header">
        <Link className="brand brand-wide" href="/" aria-label="Suvarna Cinefusion home">
          <span className="brand-mark">S</span>
          <span>Suvarna <span className="brand-dot">Cinefusion</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className="active" href="/portfolio">Portfolio</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="header-actions">
          <button className="theme-button" id="themeButton" type="button" aria-label="Toggle color theme">
            <span>◐</span>
          </button>
          <button className="mobile-menu-btn" aria-label="Open mobile menu">☰</button>
          <a className="button button-small button-solid" href="mailto:hello@suvarnacinefusion.com">
            Let’s talk <span>↗</span>
          </a>
        </div>
      </header>

      <main className="page-main">
        <section className="page-hero section-shell">
          <div className="section-kicker"><span>01 / CLIENT PORTFOLIO</span></div>
          <h1>Our clients’<br /><em>portfolio.</em></h1>
          <p>Every identity, launch, and digital experience starts with the people it is for. Here are a few worlds we have helped bring into focus.</p>
        </section>

        <section className="page-section section-shell">
          <div className="filter-panel">
            <span className="eyebrow">Featured 2024—2026</span>
          </div>
          <div className="portfolio-grid" id="productGrid">
            {/* Portfolio items will be dynamically loaded here by app.js */}
          </div>
        </section>

        <section className="page-section section-shell">
          <div className="minor-heading">
            <div>
              <span className="section-kicker">A WIDER VIEW</span>
              <h2>One studio,<br /><em>many formats.</em></h2>
            </div>
            <p>From still identities to spatial campaigns and websites that hold attention longer.</p>
          </div>
          <div className="stats">
            <div><strong>46</strong><span>Client stories<br />released</span></div>
            <div><strong>13</strong><span>Industries<br />explored</span></div>
            <div><strong>09</strong><span>Countries<br />collaborated with</span></div>
            <div><strong>02</strong><span>Weeks to first<br />creative direction</span></div>
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <span>© 2026 SUVARNA CINEFUSION</span>
        <span className="footer-links">
          <Link href="/admin" className="admin-login-link">Admin Login</Link>
          <a href="mailto:hello@suvarnacinefusion.com">Email</a>
          <Link href="/">Home</Link>
        </span>
      </footer>

      <div className="mobile-nav-overlay">
        <button className="mobile-nav-close" aria-label="Close mobile menu">×</button>
        <nav className="mobile-nav-links">
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </>
  );
}
