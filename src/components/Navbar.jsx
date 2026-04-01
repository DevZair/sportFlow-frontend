import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Dumbbell, LogOut, LayoutDashboard, Calendar, CheckSquare } from 'lucide-react';

const NAV_LINKS_KEYS = [
  { to: '/', labelKey: 'home' },
  { to: '/sections', labelKey: 'sections' },
  { to: '/schedule', labelKey: 'schedule' },
];

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { lang, switchLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(10,10,26,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.3rem' }}>
          <div style={{ width: '2.2rem', height: '2.2rem', background: 'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={18} color="#fff" />
          </div>
          <span style={{ background: 'linear-gradient(135deg,#fff,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SportFlow</span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {NAV_LINKS_KEYS.map(link => (
            <Link key={link.to} to={link.to} style={{
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: location.pathname === link.to ? 'var(--primary-light)' : 'var(--text-muted)',
              background: location.pathname === link.to ? 'rgba(99,102,241,0.1)' : 'transparent',
              transition: 'all 0.2s',
            }}>{t(link.labelKey)}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language switcher */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '0.5rem', padding: '3px' }}>
            {['ru', 'kz'].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: lang === l ? 'var(--primary)' : 'transparent',
                color: lang === l ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
              }}>
                {l === 'ru' ? 'RU' : 'KZ'}
              </button>
            ))}
          </div>

          {userInfo ? (
            <>
              {userInfo.role === 'trainer' ? (
                <Link to="/dashboard" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <LayoutDashboard size={16} /> {t('dashboard')}
                </Link>
              ) : (
                <>
                  <Link to="/my-bookings" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    <Calendar size={16} /> {t('myBookings')}
                  </Link>
                  <Link to="/my-attendance" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    <CheckSquare size={16} /> {t('myAttendance')}
                  </Link>
                </>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '2rem', height: '2rem', background: 'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{userInfo.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-icon" title={t('logout')}><LogOut size={16} /></button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>{t('login')}</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>{t('register')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
