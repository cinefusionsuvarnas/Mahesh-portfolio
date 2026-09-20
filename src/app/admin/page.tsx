"use client";

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import '../subpage.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('offers');
  const [offers, setOffers] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [orderSearch, setOrderSearch] = useState('');

  // Form states
  const [offerData, setOfferData] = useState({ title: '', type: '', price_basic: '', price_advanced: '', price_premium: '', description: '' });
  const [portfolioData, setPortfolioData] = useState({ title: '', category: '', year: '', description: '' });
  const [offerImage, setOfferImage] = useState<File | null>(null);
  const [portfolioImage, setPortfolioImage] = useState<File | null>(null);

  useEffect(() => {
    document.body.classList.add('inner-page');
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

    if (activeTab === 'offers') {
      fetchOffers();
    } else if (activeTab === 'portfolioList') {
      fetchPortfolio();
    } else if (activeTab === 'orders') {
      fetchOrders(1, orderSearch);
    }

    return () => {
      document.body.classList.remove('inner-page');
    };
  }, [activeTab]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (data.success) setOffers(data.offers);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (data.success) setPortfolio(data.portfolio);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchOrders = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?page=${page}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setOrdersPage(data.currentPage);
        setOrdersTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.url;
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    let imagePath = '';
    if (offerImage) {
      imagePath = await uploadImage(offerImage);
    }
    
    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...offerData, imagePath })
    });
    
    setOfferData({ title: '', type: '', price_basic: '', price_advanced: '', price_premium: '', description: '' });
    setOfferImage(null);
    setActiveTab('offers');
  };

  const handleDeleteOffer = async (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      await fetch(`/api/offers?id=${id}`, { method: 'DELETE' });
      fetchOffers();
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    let imagePath = '';
    if (portfolioImage) {
      imagePath = await uploadImage(portfolioImage);
    }
    
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...portfolioData, imagePath })
    });
    
    setPortfolioData({ title: '', category: '', year: '', description: '' });
    setPortfolioImage(null);
    setActiveTab('portfolioList');
  };

  const handleDeletePortfolio = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
      fetchPortfolio();
    }
  };

  return (
    <>
      <div className="site-noise" aria-hidden="true"></div>
      <header className="site-header">
        <Link className="brand brand-wide" href="/">
          <span className="brand-mark">S</span>
          <span>Suvarna <span className="brand-dot">Cinefusion</span></span>
        </Link>
        <div className="header-actions">
          <button className="theme-button" id="themeButton" type="button">
            <span>◐</span>
          </button>
        </div>
      </header>

      <main className="page-main admin-layout" style={{ minHeight: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', padding: '120px 20px 40px', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="dashboard-container" style={{ background: 'rgba(15, 12, 23, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '40px', width: '100%', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
          
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '32px', margin: 0 }}>Manage <em style={{ fontFamily: 'var(--serif)', color: 'var(--lime)', fontStyle: 'normal' }}>Dashboard</em></h2>
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Logout</button>
          </div>

          <div className="tabs" style={{ display: 'flex', gap: '15px', marginBottom: '35px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
            {['offers', 'orders', 'addOffer', 'portfolioList', 'addPortfolio'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'transparent', border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: '"Manrope", sans-serif', fontSize: '15px', fontWeight: 600,
                  color: activeTab === tab ? 'var(--lime)' : 'var(--muted)',
                  borderBottom: `2px solid ${activeTab === tab ? 'var(--lime)' : 'transparent'}`,
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {tab === 'offers' ? 'Current Offers' : tab === 'orders' ? 'Orders' : tab === 'addOffer' ? 'Add Offer' : tab === 'portfolioList' ? 'Portfolio Items' : 'Add Portfolio Item'}
              </button>
            ))}
          </div>

          {activeTab === 'offers' && (
            <div>
              {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                  {offers.length === 0 ? <p>No offers available.</p> : offers.map(offer => (
                    <div key={offer.id} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ color: 'var(--lime)', fontSize: '18px' }}>{offer.title}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', margin: '10px 0', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>{offer.type || 'Offer'}</div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', flexGrow: 1 }}>{offer.description}</p>
                      <button onClick={() => handleDeleteOffer(offer.id)} style={{ background: 'rgba(255, 95, 95, 0.05)', border: '1px solid rgba(255, 95, 95, 0.2)', color: '#ff5f5f', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="text" 
                  value={orderSearch}
                  onChange={(e) => {
                    setOrderSearch(e.target.value);
                    fetchOrders(1, e.target.value);
                  }}
                  placeholder="Search orders by name, email, or txn ID..." 
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', color: '#ffffff', padding: '12px 15px', borderRadius: '8px', outline: 'none', fontSize: '14px' }} 
                />
              </div>
              {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px' }}>
                  {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => {
                    const orderDate = new Date(order.created_at);
                    const formattedDate = orderDate.toLocaleString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    });

                    return (
                      <div key={order.id} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <strong style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>Order #{order.id}</strong>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{formattedDate}</span>
                          </div>
                          <span style={{ fontFamily: '"DM Mono"', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 500, fontSize: '14px' }}>
                            ₹{order.total_amount}
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                          <span style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Customer Info</span>
                          <strong>{order.customer_name}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                            <a href={`mailto:${order.customer_email}`} style={{ color: 'var(--lime)', textDecoration: 'none' }}>{order.customer_email}</a><br />
                            {order.customer_phone && <>Phone: {order.customer_phone}<br /></>}
                            {order.transaction_id && <>Txn ID: <strong style={{ color: '#fff' }}>{order.transaction_id}</strong></>}
                          </div>
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', flexGrow: 1 }}>
                          <span style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, display: 'block', marginBottom: '12px' }}>Items Purchased</span>
                          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(order.items || []).map((item: any, i: number) => (
                              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  {item.image ? <img src={`/${item.image}`} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} alt="" /> : <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></div>}
                                  <span style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{item.name || 'Unknown Item'}</span>
                                </div>
                                <span style={{ fontFamily: '"DM Mono"', fontWeight: 500, color: 'var(--lime)' }}>₹{item.price}</span>
                              </li>
                            ))}
                            {!(order.items && order.items.length) && <li style={{ color: '#ff5f5f', fontSize: '12px' }}>No items found in this order.</li>}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {ordersTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
                  {Array.from({ length: ordersTotalPages }).map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => fetchOrders(i + 1, orderSearch)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid transparent', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', ...(ordersPage === i + 1 ? { background: 'var(--lime)', color: '#17121e', borderColor: 'var(--lime)' } : { background: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }) }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addOffer' && (
            <div style={{ maxWidth: '640px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.015)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <h3 style={{ fontSize: '22px', marginTop: 0, borderBottom: '1px solid var(--line)', paddingBottom: '15px', marginBottom: '20px' }}>Add New Offer</h3>
              <form onSubmit={handleAddOffer}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Offer Image</label>
                  <input type="file" onChange={(e) => setOfferImage(e.target.files?.[0] || null)} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Title</label>
                  <input required value={offerData.title} onChange={e => setOfferData({...offerData, title: e.target.value})} type="text" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Offer Type</label>
                  <input required value={offerData.type} onChange={e => setOfferData({...offerData, type: e.target.value})} type="text" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Basic Price</label>
                    <input required value={offerData.price_basic} onChange={e => setOfferData({...offerData, price_basic: e.target.value})} type="number" step="0.01" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Adv. Price</label>
                    <input required value={offerData.price_advanced} onChange={e => setOfferData({...offerData, price_advanced: e.target.value})} type="number" step="0.01" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Premium Price</label>
                    <input required value={offerData.price_premium} onChange={e => setOfferData({...offerData, price_premium: e.target.value})} type="number" step="0.01" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Description</label>
                  <textarea required value={offerData.description} onChange={e => setOfferData({...offerData, description: e.target.value})} style={{ width: '100%', minHeight: '100px', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }}></textarea>
                </div>
                <button type="submit" className="button button-solid" style={{ width: '100%' }}>Publish</button>
              </form>
            </div>
          )}

          {activeTab === 'portfolioList' && (
            <div>
              {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                  {portfolio.length === 0 ? <p>No portfolio items.</p> : portfolio.map(item => (
                    <div key={item.id} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                      {item.imagePath && <img src={item.imagePath} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />}
                      <strong style={{ color: 'var(--lime)', fontSize: '18px' }}>{item.title}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', margin: '10px 0', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>{item.category}</div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', flexGrow: 1 }}>{item.description}</p>
                      <button onClick={() => handleDeletePortfolio(item.id)} style={{ background: 'rgba(255, 95, 95, 0.05)', border: '1px solid rgba(255, 95, 95, 0.2)', color: '#ff5f5f', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addPortfolio' && (
            <div style={{ maxWidth: '640px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.015)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <h3 style={{ fontSize: '22px', marginTop: 0, borderBottom: '1px solid var(--line)', paddingBottom: '15px', marginBottom: '20px' }}>Add Portfolio Item</h3>
              <form onSubmit={handleAddPortfolio}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Image</label>
                  <input required type="file" onChange={(e) => setPortfolioImage(e.target.files?.[0] || null)} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Title</label>
                  <input required value={portfolioData.title} onChange={e => setPortfolioData({...portfolioData, title: e.target.value})} type="text" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }} />
                </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Category</label>
                    <select required value={portfolioData.category} onChange={e => setPortfolioData({...portfolioData, category: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }}>
                      <option style={{ background: '#111', color: '#fff' }} value="">Select Category</option>
                      <option style={{ background: '#111', color: '#fff' }} value="Wedding Videos">Wedding Videos</option>
                      <option style={{ background: '#111', color: '#fff' }} value="YouTube Videos">YouTube Videos</option>
                      <option style={{ background: '#111', color: '#fff' }} value="Professional Post-Production">Professional Post-Production</option>
                      <option style={{ background: '#111', color: '#fff' }} value="Short-Form Content">Short-Form Content</option>
                      <option style={{ background: '#111', color: '#fff' }} value="Corporate & Event Videos">Corporate & Event Videos</option>
                    </select>
                  </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Description</label>
                  <textarea required value={portfolioData.description} onChange={e => setPortfolioData({...portfolioData, description: e.target.value})} style={{ width: '100%', minHeight: '100px', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'white' }}></textarea>
                </div>
                <button type="submit" className="button button-solid" style={{ width: '100%' }}>Publish</button>
              </form>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
