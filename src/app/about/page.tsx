"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import '../subpage.css';

export default function About() {
  useEffect(() => {
    document.body.classList.add('inner-page');
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

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
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/services">Services</Link>
          <Link className="active" href="/about">About</Link>
        </nav>
        <div className="header-actions">
          <button className="theme-button" id="themeButton" type="button" aria-label="Toggle color theme">
            <span>◐</span>
          </button>
          <button className="mobile-menu-btn" aria-label="Open mobile menu">☰</button>
          <a className="button button-small button-solid" href="mailto:hello@suvarnacinefusion.com">Let’s talk <span>↗</span></a>
        </div>
      </header>

      <main className="page-main">
        <section className="page-hero section-shell">
          <div className="section-kicker"><span>ABOUT ME</span></div>
          <h1>I craft stories that<br /><em>deserve to be remembered.</em></h1>
          <p>I’m a passionate professional video editor dedicated to turning creative ideas into powerful visual stories. With a strong eye for detail, I believe every frame has the potential to create an emotion.</p>
        </section>

        <section className="page-section section-shell">
          <div className="about-layout">
            <p className="about-lead">My approach to editing combines creativity, precision, and a deep understanding of visual storytelling. I specialize in cinematic wedding films, social media content, YouTube videos, and promotional projects.</p>
            <div className="about-copy">
              <p>I enjoy transforming raw footage into polished, engaging, and meaningful visual experiences. From seamless cuts and smooth transitions to color grading and sound design, I focus on every detail.</p>
              <p>My goal is to make every project visually appealing while keeping the story natural and authentic. I work closely with clients to understand their vision and bring their ideas to life through editing.</p>
              <a className="text-link" href="mailto:hello@suvarnacinefusion.com">Let's create something together <span>↗</span></a>
            </div>
          </div>
        </section>

        <section className="page-section section-shell">
          <div className="minor-heading">
            <div>
              <span className="section-kicker">MY WORKFLOW & GOAL</span>
              <h2>Crafting stories<br /><em>with purpose.</em></h2>
            </div>
            <p>I believe great editing can turn ordinary footage into something truly extraordinary.</p>
          </div>
          <div className="values-list">
            <article className="value">
              <span>01</span>
              <h3>Creative Approach</h3>
              <p>Every project is approached with dedication, creativity, and a commitment to delivering quality work.</p>
            </article>
            <article className="value">
              <span>02</span>
              <h3>Continuous Growth</h3>
              <p>I’m always ready to learn, experiment, and continuously explore new editing techniques and modern visual trends.</p>
            </article>
            <article className="value">
              <span>03</span>
              <h3>Lasting Impressions</h3>
              <p>My aim is to create visuals that capture attention, communicate emotions, and leave a lasting impression.</p>
            </article>
          </div>
        </section>

        <section className="page-section section-shell">
          <div className="minor-heading">
            <div>
              <span className="section-kicker">MY COMMITMENT</span>
              <h2>Dedicated to<br /><em>excellence.</em></h2>
            </div>
            <p>Video editing is more than a profession—it is a way of connecting stories with people. My journey is driven by passion, continuous growth, and the desire to create meaningful visual stories.</p>
          </div>
          <div className="timeline">
            <article>
              <time>01</time>
              <h3>Long-Term Relationships</h3>
              <p>I value clear communication, reliability, creativity, and long-term relationships with my clients.</p>
            </article>
            <article>
              <time>02</time>
              <h3>Full Attention</h3>
              <p>Whether it’s an emotional wedding story or an energetic social media reel, I give every project my full attention.</p>
            </article>
            <article>
              <time>03</time>
              <h3>Memorable Work</h3>
              <p>I take pride in creating work that not only looks professional but also feels memorable and authentic.</p>
            </article>
            <article>
              <time>04</time>
              <h3>Absolute Dedication</h3>
              <p>With passion behind every project and purpose behind every edit, I strive to deliver my best work every time.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <span>© 2026 SUVARNA CINEFUSION</span>
        <span className="footer-links">
          <Link href="/portfolio">Portfolio</Link>
          <a href="mailto:hello@suvarnacinefusion.com">Email</a>
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
