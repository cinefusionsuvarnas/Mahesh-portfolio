"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
    
    // Load app.js and mobile-nav.js dynamically if needed or rewrite them in React
    const script = document.createElement('script');
    script.src = '/js/app.js?v=2';
    document.body.appendChild(script);

    const navScript = document.createElement('script');
    navScript.src = '/js/mobile-nav.js';
    document.body.appendChild(navScript);

    return () => {
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
          <Link href="/about">About</Link>
        </nav>
        <div className="header-actions">
          <button className="theme-button" id="themeButton" type="button" aria-label="Toggle color theme">
            <span>◐</span>
          </button>
          <button className="mobile-menu-btn" aria-label="Open mobile menu">☰</button>
          <a className="button button-small button-solid" href="#contact">
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-grid"></div>
          <div className="hero-copy reveal">
            <div className="eyebrow"><span className="live-dot"></span> Suvarna Cinefusion · Creative studio for ambitious brands</div>
            <h1>Welcome to<br /><em>Suvarna Cinefusion.</em></h1>
            <p className="hero-description">We turn distinctive ideas into client portfolios, campaign systems, and brand stories people carry with them.</p>
            <div className="hero-buttons">
              <Link className="button button-solid" href="/portfolio">
                See client work <span aria-hidden="true">↓</span>
              </Link>
              <Link className="button" href="/services" style={{ backgroundColor: '#ceff1a', color: '#09070e', border: 'none', fontWeight: 700, boxShadow: '0 0 20px rgba(206, 255, 26, 0.4)', textShadow: 'none' }}>
                Editor Assets <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="proof-row">
              <div className="avatar-stack" aria-label="Trusted by makers at leading teams">
                <span className="av a1">A</span><span className="av a2">S</span><span className="av a3">J</span><span className="av a4">N</span>
              </div>
              <p>Trusted by 40+ teams<br /><strong>from first spark to premiere</strong></p>
            </div>
          </div>
          <div className="hero-art reveal reveal-delay">
            <div className="hero-image-frame">
              <img className="hero-edit-image" src="/assets/images/homepage.jpg" alt="Video editing workspace on a large monitor" />
              <div className="orb orb-one"></div>
              <div className="orb orb-two"></div>
              <div className="hero-edge-overlays" aria-hidden="true">
                <div className="hero-pill hero-pill-tl">
                  <span className="pill-dot"></span>
                  <div><small>STUDIO</small><strong>Live session</strong></div>
                </div>
                <div className="hero-pill hero-pill-tr">
                  <small>MASTER</small><strong>4K · ProRes</strong>
                </div>
                <div className="hero-pill hero-pill-ml">
                  <span className="pill-icon">✦</span>
                  <div><small>REACH</small><strong>+27% <i>↗</i></strong></div>
                </div>
                <div className="hero-pill hero-pill-mr hero-pill-tools">
                  <span title="Timeline">◫</span>
                  <span title="Color">◈</span>
                  <span className="pill-tool-accent" title="Preview">▶</span>
                  <span title="Audio">♪</span>
                </div>
                <div className="hero-pill hero-pill-bl">
                  <span className="pill-dot pill-dot-amber"></span> In post-production
                </div>
                <div className="hero-pill hero-pill-br">
                  <span className="pill-avatars"><i></i><i></i><i></i></span>
                  <div><small>TEAM</small><strong>12 this week</strong></div>
                </div>
              </div>
            </div>
          </div>
          <div className="scroll-note"><span></span> Scroll to explore</div>
        </section>

        <section className="stats section-shell reveal">
          <div><strong>01</strong><span>Years building<br />braver brands</span></div>
          <div><strong>26</strong><span>Client stories<br />brought to life</span></div>
          <div><strong>2k</strong><span>Moments made<br />to beabout shared</span></div>
          <div><strong>99<span>%</span></strong><span>Of projects delivered<br />with intent</span></div>
        </section>

        <section className="home-index section-shell reveal" aria-label="Explore Suvarna Cinefusion">
          <div className="home-index-intro"><span className="section-kicker">EXPLORE THE COMPANY</span>
            <h2>Four ways to<br /><em>get to know us.</em></h2>
            <p>Start with the client work, browse our design files, see past projects, or learn the story behind Suvarna Cinefusion.</p>
          </div>
          <div className="home-index-links">
            <Link className="page-door door-portfolio" href="/portfolio">
              <div className="door-content">
                <span>01 / PORTFOLIO</span>
                <strong>Client stories</strong>
                <p>Explore our curated selection of featured works.</p>
              </div>
              <i>↗</i>
            </Link>
            <Link className="page-door door-services" href="/services">
              <div className="door-content">
                <span>02 / SERVICES</span>
                <strong>Design files</strong>
                <p>Tools and assets to elevate your creative process.</p>
              </div>
              <i>↗</i>
            </Link>
            <Link className="page-door door-about" href="/about">
              <div className="door-content">
                <span>04 / ABOUT</span>
                <strong>Our company</strong>
                <p>The story, the people, and the vision behind our studio.</p>
              </div>
              <i>↗</i>
            </Link>
          </div>
        </section>

        <section className="section-shell products-section" id="portfolio-preview">
          <div className="section-kicker reveal"><span>01 / CLIENT PORTFOLIO</span><span>Distinct worlds made for real people.</span></div>
          <div className="section-heading row-heading reveal">
            <h2>Work that makes<br /><em>the room look twice.</em></h2>
            <p>Selected client partnerships across brand, web, film, and digital experiences.</p>
          </div>
          <div className="product-controls reveal">
            <div className="filter-pills" role="group" aria-label="Portfolio filters">
              <button className="pill active" data-filter="all">All work <span></span></button>
              <button className="pill" data-filter="Wedding Videos">Wedding Videos</button>
              <button className="pill" data-filter="YouTube Videos">YouTube Videos</button>
              <button className="pill" data-filter="Professional Post-Production">Professional Post-Production</button>
              <button className="pill" data-filter="Short-Form Content">Short-Form Content</button>
              <button className="pill" data-filter="Corporate & Event Videos">Corporate & Event Videos</button>
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input id="productSearch" type="search" placeholder="Search client work" aria-label="Search client work" />
            </label>
          </div>
          <div className="carousel-container reveal">
            <button className="carousel-arrow" id="prevProduct" aria-label="Previous">❮</button>
            <div className="product-grid" id="productGrid">
              {/* Portfolio items loaded via API */}
            </div>
            <button className="carousel-arrow" id="nextProduct" aria-label="Next">❯</button>
          </div>
          <div className="center-action reveal">
            <Link className="text-link" href="/portfolio">Explore the client portfolio <span>→</span></Link>
          </div>
        </section>

        <section className="quote-band section-shell reveal"><span className="quote-star">✳</span>
          <blockquote>“The greatest performance improvement is the transition from not working to working.”</blockquote>
          <cite>— John Ousterhout <span> · adapted for builders</span></cite>
        </section>

        <section className="section-shell services-section" id="services">
          <div className="services-intro reveal">
            <div className="section-kicker"><span>02 / WORK TOGETHER</span></div>
            <h2>From first thought<br />to <em>felt experience.</em></h2>
            <p>We partner with ambitious people at the points where care, clarity, and creative direction matter most.</p>
            <Link className="button button-light" href="/services">Explore services <span>↗</span></Link>
          </div>
          <div className="services-list reveal">
            <article><span className="service-number">01</span>
              <div>
                <h3>Wedding Highlights</h3>
                <p>Cinematic highlights capturing the best moments of your special day.</p><span className="tags"><i>Highlights</i><i>Teasers</i><i>Documentary</i></span>
              </div><Link href="/services" aria-label="Explore Wedding Highlights">↗</Link>
            </article>
            <article><span className="service-number">02</span>
              <div>
                <h3>Pre Weddings</h3>
                <p>Beautifully crafted pre-wedding films that tell your unique love story.</p><span className="tags"><i>Concept</i><i>Cinematic</i><i>Storytelling</i></span>
              </div><Link href="/services" aria-label="Explore Pre Weddings">↗</Link>
            </article>
            <article><span className="service-number">03</span>
              <div>
                <h3>Commercial Ads Shoots</h3>
                <p>High-end color grading, sound design, and commercial video production.</p><span className="tags"><i>Color Grading</i><i>Sound Design</i><i>Corporate</i></span>
              </div><Link href="/services" aria-label="Explore Commercial Ads Shoots">↗</Link>
            </article>
            <article><span className="service-number">04</span>
              <div>
                <h3>Podcast Editing</h3>
                <p>Professional audio mixing and multi-cam video editing for your podcast.</p><span className="tags"><i>Audio Mix</i><i>Multi-cam</i><i>Shorts</i></span>
              </div><Link href="/services" aria-label="Explore Podcast Editing">↗</Link>
            </article>
            <article><span className="service-number">05</span>
              <div>
                <h3>YouTube Videos</h3>
                <p>Engaging, fast-paced edits optimized for audience retention and growth.</p><span className="tags"><i>Vlogs</i><i>Gaming</i><i>Educational</i></span>
              </div><Link href="/services" aria-label="Explore YouTube Videos">↗</Link>
            </article>
          </div>
        </section>

        <section className="section-shell work-section" id="work" style={{ overflow: 'hidden' }}>
          <div className="section-kicker reveal"><span>03 / SELECTED WORK</span><span>A few things I’m proud to put my name on.</span></div>
          <div className="admin-scroll-wrapper reveal" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', position: 'relative', marginTop: 40, overflow: 'hidden' }}>
            <div className="admin-scroll-track" id="adminScrollTrack" style={{ display: 'flex', gap: 30, width: 'max-content', padding: '0 40px' }}>
              {/* Dynamically loaded by app.js */}
            </div>
          </div>
        </section>

        <section className="testimonials section-shell reveal">
          <div className="testimonial-intro"><span className="eyebrow"><span className="live-dot"></span> KIND WORDS</span>
            <h2>Trusted with<br />the <em>important stuff.</em></h2>
            <div className="testimonial-controls">
              <button id="prevTestimonial" aria-label="Previous testimonial">←</button>
              <button id="nextTestimonial" aria-label="Next testimonial">→</button>
            </div>
          </div>
          <div className="testimonial-stage">
            <article className="testimonial active">
              <div className="rating">★★★★★</div>
              <blockquote>“Suvarna Cinefusion understood the feeling we were trying to create before we had the words for it. They gave the brand its own pulse.”</blockquote>
              <div className="person"><span className="person-avatar ava-purple">AS</span><span><strong>Ananya Sharma</strong><small>Co-founder, Veda</small></span></div>
            </article>
            <article className="testimonial">
              <div className="rating">★★★★★</div>
              <blockquote>“The pace was electric, but nothing felt rushed. We went from a blurry concept to a world our customers recognised immediately.”</blockquote>
              <div className="person"><span className="person-avatar ava-orange">RD</span><span><strong>Rohan Desai</strong><small>CEO, Nila</small></span></div>
            </article>
            <article className="testimonial">
              <div className="rating">★★★★★</div>
              <blockquote>“Every decision had a reason. The new identity made the whole team feel braver about what came next.”</blockquote>
              <div className="person"><span className="person-avatar ava-blue">PK</span><span><strong>Priya Kapoor</strong><small>Product lead, Aarna</small></span></div>
            </article>
            <article className="testimonial">
              <div className="rating">★★★★★</div>
              <blockquote>“The attention to detail and color grading was absolutely phenomenal. They captured the exact mood we were going for.”</blockquote>
              <div className="person"><span className="person-avatar" style={{ background: '#55a88c', color: '#fff' }}>KR</span><span><strong>Karthik Reddy</strong><small>Director, Sitara Studios</small></span></div>
            </article>
            <article className="testimonial">
              <div className="rating">★★★★★</div>
              <blockquote>“A seamless collaboration from start to finish. The team brings a level of craft that elevates the entire project.”</blockquote>
              <div className="person"><span className="person-avatar" style={{ background: '#cc6e88', color: '#fff' }}>HP</span><span><strong>Harika Prasad</strong><small>Creative Head, Maya Media</small></span></div>
            </article>
            <div className="testimonial-counter"><span id="testimonialIndex">01</span> <i></i> 05</div>
          </div>
        </section>

        <section className="section-shell faq-section">
          <div className="section-kicker reveal"><span>04 / GOOD TO KNOW</span></div>
          <div className="faq-layout">
            <div className="reveal">
              <h2>Questions,<br /><em>answered.</em></h2>
              <p>Can’t find what you’re after? We are always happy to talk through it.</p><a className="text-link" href="mailto:hello@suvarnacinefusion.com">hello@suvarnacinefusion.com <span>↗</span></a>
            </div>
            <div className="accordion reveal">
              <details open>
                <summary>What kind of projects are a good fit?<span>+</span></summary>
                <p>Work where a brand or experience needs a truer point of view — from an early idea to a thoughtful reintroduction.</p>
              </details>
              <details>
                <summary>How do engagements usually work?<span>+</span></summary>
                <p>Most collaborations start with a discovery sprint, then move into focused weekly cycles with clear creative direction and progress.</p>
              </details>
              <details>
                <summary>Can I purchase products for my team?<span>+</span></summary>
                <p>Absolutely. Every studio good includes team-friendly licensing and straightforward documentation to help everyone get moving quickly.</p>
              </details>
              <details>
                <summary>Do you work with teams outside India?<span>+</span></summary>
                <p>Yes. We collaborate remotely with people across time zones, using an intentionally small, responsive communication rhythm.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="contact-section section-shell" id="contact">
          <div className="contact-glow"></div><span className="contact-mark">S</span>
          <div className="contact-content reveal"><span className="eyebrow"><span className="live-dot"></span> HAVE SOMETHING IN MIND?</span>
            <h2>Let’s make it<br /><em>matter.</em></h2>
            <p>Tell us about the good thing you’re trying to bring into the world.</p><a className="button button-solid big-button" href="mailto:hello@suvarnacinefusion.com">Start a conversation <span>↗</span></a>
          </div>
          <div className="contact-bottom"><span>© 2026 SUVARNA CINEFUSION</span><span>SRIKAKULAM · WORKING GLOBALLY</span><span className="contact-links"><a href="#top">LinkedIn</a><a href="#top">X / Twitter</a><a href="#top">Dribbble</a></span></div>
        </section>
      </main>
      
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
