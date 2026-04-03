import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Dumbbell, LogOut, LayoutDashboard, Calendar, CheckSquare, Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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

        {/* Right side Desktop */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn btn-icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-container" style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--bg)', borderBottom: '1px solid var(--border)',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem',
          boxShadow: 'var(--shadow)'
        }}>
          {NAV_LINKS_KEYS.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)} style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
              color: location.pathname === link.to ? 'var(--primary-light)' : 'var(--text-muted)',
              background: location.pathname === link.to ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
            }}>{t(link.labelKey)}</Link>
          ))}
          
          <div style={{ height: '1px', background: 'var(--border)' }} />
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             {['ru', 'kz'].map(l => (
               <button key={l} onClick={() => { switchLang(l); setIsMobileMenuOpen(false); }} className={`btn ${lang === l ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, padding: '0.5rem' }}>
                 {l.toUpperCase()}
               </button>
             ))}
          </div>

          {userInfo ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', padding: '0.5rem' }}>
                <div style={{ width: '2rem', height: '2rem', background: 'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span>{userInfo.name}</span>
              </div>
              {userInfo.role === 'trainer' ? (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-outline"><LayoutDashboard size={16}/> {t('dashboard')}</Link>
              ) : (
                <>
                  <Link to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-outline"><Calendar size={16}/> {t('myBookings')}</Link>
                  <Link to="/my-attendance" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-outline"><CheckSquare size={16}/> {t('myAttendance')}</Link>
                </>
              )}
              <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="btn btn-danger" style={{ marginTop: '0.5rem' }}>
                <LogOut size={16} /> {t('logout')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-outline">{t('login')}</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary">{t('getStarted')}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
