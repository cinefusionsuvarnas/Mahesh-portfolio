"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Invalid username or password');
    } else {
      router.push('/admin');
    }
  };

  return (
    <>
      <div className="site-noise" aria-hidden="true"></div>
      <header className="site-header">
        <Link className="brand brand-wide" href="/" aria-label="Suvarna Cinefusion home">
          <span className="brand-mark">S</span>
          <span>Suvarna <span className="brand-dot">Cinefusion</span></span>
        </Link>
      </header>

      <main className="page-main admin-layout" style={{ minHeight: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', padding: '120px 20px 40px', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="admin-box" style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)', textAlign: 'center', margin: 'auto' }}>
          <h2 style={{ fontSize: '32px', marginTop: 0, marginBottom: '25px' }}>Admin <em style={{ fontFamily: 'var(--serif)', color: 'var(--lime)', fontStyle: 'normal' }}>Panel</em></h2>
          
          {error && <div className="auth-message" style={{ fontSize: '12px', marginBottom: '20px', color: '#ff5f5f', display: 'block' }}>{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label htmlFor="username" style={{ display: 'block', font: '11px "DM Mono"', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>Username</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Enter username" 
                style={{ width: '100%', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--line)', color: '#ffffff', padding: '12px 15px', borderRadius: '8px', outline: 'none', fontSize: '15px', fontWeight: 500 }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label htmlFor="password" style={{ display: 'block', font: '11px "DM Mono"', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
              <div className="password-wrapper" style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Enter password" 
                  style={{ width: '100%', paddingRight: '40px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--line)', color: '#ffffff', padding: '12px 15px', borderRadius: '8px', outline: 'none', fontSize: '15px', fontWeight: 500 }}
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={() => setShowPassword(!showPassword)} 
                  aria-label="Toggle password visibility"
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: showPassword ? '#ffffff' : 'var(--muted)', padding: '5px', cursor: 'pointer', zIndex: 5 }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>
            
            <button type="submit" className="button button-solid" style={{ width: '100%', marginTop: '10px' }}>Secure Login <span>→</span></button>
          </form>
        </div>
      </main>
    </>
  );
}
