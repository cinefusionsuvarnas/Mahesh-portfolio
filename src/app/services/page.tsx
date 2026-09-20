'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ServicesPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOffers(data.offers);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Inject scripts
    const script1 = document.createElement('script');
    script1.src = '/js/app.js?v=2';
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = '/js/mobile-nav.js';
    document.body.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = '/js/shop.js?v=8';
    document.body.appendChild(script3);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
    };
  }, []);

  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const paginatedOffers = offers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openProductModal = (offer: any) => {
    // We bind to the global window function from shop.js / legacy logic
    // but since we render our own React modal we don't necessarily need to.
    // Instead we can just trigger handleBuyClick directly or build a React modal.
    // Let's implement the buy button natively to integrate with shop.js
    const productName = offer.title;
    const productPrice = offer.price || 0;
    const productImage = offer.imagePath || '';

    // Call the global function injected by shop.js
    if (typeof window !== 'undefined' && (window as any).handleBuyClick) {
      // Actually handleBuyClick is not exposed to window in shop.js, it uses event delegation.
      // So we can just create a dummy button and click it to let shop.js handle it.
      const btn = document.createElement('button');
      btn.className = 'buy-button';
      btn.dataset.product = productName;
      btn.dataset.price = productPrice.toString();
      btn.dataset.image = productImage;
      document.body.appendChild(btn);
      btn.click();
      document.body.removeChild(btn);
    }
  };

  return (
    <div className="inner-page">
      <Head>
        <title>Services — Video Editing, Grading & Photography | Suvarna Cinefusion</title>
      </Head>
      <div className="site-noise" aria-hidden="true"></div>
      
      <header className="site-header">
        <a className="brand brand-wide" href="/" aria-label="Suvarna Cinefusion home">
          <span className="brand-mark">S</span>
          <span>Suvarna <span className="brand-dot">Cinefusion</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/portfolio">Portfolio</a>
          <a className="active" href="/services">Services</a>
          <a href="/about">About</a>
        </nav>
        <div className="header-actions">
          <button id="cartToggleBtn" className="button button-small button-ghost" style={{ padding: '0 14px', gap: '8px' }} aria-label="Open Cart">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span id="cartCountHeader">0</span>
          </button>
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
          <div className="section-kicker"><span>02 / SERVICES + DESIGN FILES</span></div>
          <h1>Design files,<br /><em>ready for your work.</em></h1>
          <p>Buy the presentation systems, design files, and visual toolkits we use to make client work land with confidence.</p>
        </section>

        <section className="page-section section-shell">
          <div className="store-note">
            <div>
              <strong>Made for clients, shared with everyone.</strong>
              <p>Each studio good includes a personal or team-ready license, simple documentation, and instant download.</p>
            </div>
          </div>
          
          <div className="minor-heading">
            <div>
              <span className="section-kicker">THE SHOP</span>
              <h2>Files that feel<br /><em>finished.</em></h2>
            </div>
            <p>Thoughtful templates and flexible visual assets to give your next idea a sharper start.</p>
          </div>
          
          <div className="product-store-grid" id="productStoreGrid">
            {loading ? (
              <p style={{ color: 'var(--muted)', padding: '40px 0' }}>Loading offers...</p>
            ) : offers.length === 0 ? (
              <p style={{ color: 'var(--muted)', padding: '40px 0' }}>No offers available right now.</p>
            ) : (
              paginatedOffers.map((offer, idx) => {
                const titleWords = offer.title.split(' ');
                const firstWord = titleWords[0];
                const restWords = titleWords.slice(1).join(' ');

                return (
                  <article key={offer.id || idx} className="store-card">
                    {offer.imagePath ? (
                      <div className="store-visual" style={{ backgroundImage: `url('${offer.imagePath}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    ) : (
                      <div className="store-visual">
                        <span className="asset-label">
                          {firstWord.toUpperCase()}<br /><em>{restWords.toUpperCase()}</em>
                        </span>
                        <i className="asset-shape"></i>
                      </div>
                    )}
                    <div className="store-info">
                      <span className="store-type">DIGITAL GOOD</span>
                      <h2>{offer.title}</h2>
                      <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {offer.description}
                      </p>
                      <div className="store-action">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Starting at</span>
                          <strong>₹{offer.price || 0}</strong>
                        </div>
                        <button 
                          className="buy-button button-ghost" 
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                          data-product={offer.title}
                          data-price={offer.price || 0}
                          data-image={offer.imagePath || ''}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div id="storePagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px', width: '100%', gridColumn: '1 / -1' }}>
              {currentPage > 1 && (
                <button className="button button-ghost" style={{ padding: '8px 16px' }} onClick={() => setCurrentPage(prev => prev - 1)}>← Prev</button>
              )}
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? 'button button-solid' : 'button button-ghost'}
                  style={currentPage === i + 1 ? { padding: '8px 16px', backgroundColor: 'var(--lime)', color: '#000', borderColor: 'var(--lime)' } : { padding: '8px 16px' }}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              {currentPage < totalPages && (
                <button className="button button-ghost" style={{ padding: '8px 16px' }} onClick={() => setCurrentPage(prev => prev + 1)}>Next →</button>
              )}
            </div>
          )}
        </section>

        <section className="page-section section-shell">
          <div className="services-section-stacked" style={{ padding: 0 }}>
            <div className="services-intro">
              <span className="section-kicker">BESPOKE SERVICES</span>
              <h2>Need your footage<br /><em>brought to life?</em></h2>
              <p>We transform raw footage into captivating stories. From cinematic weddings to engaging YouTube content and professional commercial edits.</p>
              <a className="button button-solid" href="mailto:hello@suvarnacinefusion.com" style={{ marginTop: '10px' }}>Start a project <span>↗</span></a>
            </div>
            <div className="services-list-new">
              {[
                { title: "Wedding Highlights", desc: "Cinematic highlights capturing the best moments of your special day.", tags: ["Highlights", "Cinematic"] },
                { title: "Pre Weddings", desc: "Beautifully crafted pre-wedding films that tell your unique love story.", tags: ["Storytelling", "Romance"] },
                { title: "Commercial Ads Shoots", desc: "High-end color grading, sound design, and commercial video production.", tags: ["Color Grading", "Commercial"] },
                { title: "Podcast Editing", desc: "Professional audio mixing and multi-cam video editing for your podcast.", tags: ["Audio Mix", "Multi-cam"] },
                { title: "YouTube Videos", desc: "Engaging, fast-paced edits optimized for audience retention and growth.", tags: ["Vlogs", "Engagement"] }
              ].map((svc, i) => (
                <a href="/portfolio" className="service-row-new" key={i}>
                  <span className="sr-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="sr-content">
                    <h3>{svc.title}</h3>
                    <p>{svc.desc}</p>
                    <div className="sr-tags">
                      {svc.tags.map((tag, j) => <span key={j}>{tag}</span>)}
                    </div>
                  </div>
                  <div className="sr-arrow">↗</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="purchase-toast" id="purchaseToast" role="status" aria-live="polite"></div>
      
      {/* Mobile nav overlay */}
      <div className="mobile-nav-overlay">
        <button className="mobile-nav-close" aria-label="Close mobile menu">✕</button>
        <nav className="mobile-nav-links">
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>

      {/* Shop.js overlays */}
      <div id="cartOverlay" className="cart-overlay"></div>
      <div id="cartSidebar" className="cart-sidebar">
        <div className="cart-header">
          <h3>
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            My Cart
          </h3>
          <button id="cartCloseBtn" className="cart-close" aria-label="Close Cart">&times;</button>
        </div>
        
        <div className="cart-content-wrapper">
          <div className="cart-body">
            <div id="cartEmptyState" className="cart-empty">
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <strong style={{ fontSize: '16px' }}>Your cart is empty</strong>
              <button id="continueShoppingBtn" className="button button-solid" style={{ marginTop: '10px' }}>Continue Shopping</button>
            </div>

            <div id="cartItemsList" style={{ display: 'none', flexDirection: 'column' }}></div>

            <div id="cartSuccessState" className="cart-empty" style={{ display: 'none', textAlign: 'center', padding: '20px 10px' }}>
              <svg viewBox="0 0 24 24" stroke="var(--lime)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animated-check">
                <path className="check-circle" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline className="check-path" points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <strong style={{ fontSize: '20px', color: 'var(--text)' }}>Your order has been placed!</strong>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '12px', lineHeight: 1.6, maxWidth: '80%' }}>We are processing your payment. You will receive the files at your email address shortly.</p>
              <button id="closeSuccessBtn" className="button button-solid" style={{ marginTop: '25px', width: '100%', fontSize: '15px', padding: '12px' }}>Close & Continue</button>
            </div>
          </div>

          <div id="cartFooter" className="cart-footer" style={{ display: 'none' }}>
            <div className="cart-total">
              <span>Total:</span>
              <span>₹<span id="cartTotalAmount">0.00</span></span>
            </div>
            
            <div className="auth-message" id="checkoutMessage" style={{ display: 'none', fontSize: '12px', marginBottom: '15px', color: '#ff5f5f' }}></div>
            
            <form id="checkoutForm" className="cart-form" noValidate>
              <div id="checkoutStep1">
                <input type="text" id="customerName" name="customer_name" required placeholder="Full Name" />
                <input type="email" id="customerEmail" name="customer_email" required placeholder="Email Address" />
                <input type="tel" id="customerPhone" name="customer_phone" required placeholder="Phone Number" pattern="[0-9+]*" />
                <button type="button" className="button button-solid" id="proceedToPayBtn" style={{ marginTop: '5px', width: '100%' }}>Proceed to Payment <span>→</span></button>
              </div>
              
              <div id="checkoutStep2" style={{ display: 'none' }}>
                <div style={{ textAlign: 'center', margin: '15px 0', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                  <p style={{ marginBottom: '10px', fontSize: '13px', color: 'var(--muted)' }}>Scan QR to Pay</p>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=merchant@upi&pn=SuvarnaCinefusion" alt="Pay with QR" id="qrCodeImg" style={{ borderRadius: '8px', width: '150px', height: '150px', background: '#fff', padding: '5px' }} />
                  <p style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Amount to pay: ₹<span id="qrAmountDisplay">0.00</span></p>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--lime)', marginBottom: '5px' }}>* Transaction ID is required for verification of payment</div>
                <input type="text" id="transactionId" name="transaction_id" required placeholder="Transaction ID / UTR Number" />
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                  <button type="button" className="button button-ghost" id="backToStep1Btn" style={{ flex: 1 }}>Back</button>
                  <button type="submit" className="button button-solid" id="submitCheckoutBtn" style={{ flex: 2 }}>Confirm Order</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="page-footer">
        <span>© 2026 SUVARNA CINEFUSION</span>
        <span className="footer-links"><a href="/portfolio">Portfolio</a><a href="mailto:hello@suvarnacinefusion.com">Email</a></span>
      </footer>
    </div>
  );
}
