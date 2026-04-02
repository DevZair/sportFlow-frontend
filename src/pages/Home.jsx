import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import { Calendar, Users, Star, Zap, Trophy, Heart, ArrowRight } from 'lucide-react';

const TRAINERS_STATIC = [
  { name: 'Алексей Морозов', sport: 'Бокс и ММА', rating: 4.9, sessions: 240, img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80' },
  { name: 'Айгерим Сейткали', sport: 'Йога и велнес', rating: 4.8, sessions: 310, img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=300&q=80' },
  { name: 'Марат Жаксыбеков', sport: 'Кроссфит и сила', rating: 4.9, sessions: 185, img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&q=80' },
];

const Home = () => {
  const { t } = useLang();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    api.get('/sections').then(r => setSections(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const STATS = [
    { icon: <Users size={24} />, value: '500+', label: t('statStudents') },
    { icon: <Trophy size={24} />, value: '15+', label: t('statSections') },
    { icon: <Star size={24} />, value: '50+', label: t('statTrainers') },
    { icon: <Heart size={24} />, value: '10K+', label: t('statSessions') },
  ];

  return (
    <div>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 1rem 4rem', maxWidth: 900, margin: '0 auto' }}>
        <div className="animate-fade-up">
          <span className="badge badge-primary" style={{ marginBottom: '1.5rem', fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            {t('heroTag')}
          </span>
        </div>
        <h1 className="animate-fade-up delay-1" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem' }}>
          {t('heroTitle1')}{' '}<span className="gradient-text">{t('heroTitleHighlight')}</span>{' '}{t('heroTitle2')}
        </h1>
        <p className="animate-fade-up delay-2" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem' }}>
          {t('heroSubtitle')}
        </p>
        <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
            <Zap size={18} /> {t('startFree')}
          </Link>
          <Link to="/schedule" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
            <Calendar size={18} /> {t('viewSchedule')}
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {STATS.map((s, i) => (
            <div key={i} className={`glass animate-fade-up delay-${i + 1}`} style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--primary-light)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg,var(--primary-light),var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sections Preview */}
      {sections.length > 0 && (
        <section style={{ padding: '2rem 0 5rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">{t('popularSections')} <span className="gradient-text">{t('sectionsWord')}</span></h2>
            <div className="divider" />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('sectionsSubtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
            {sections.map((sec, i) => (
              <SectionPreviewCard key={sec._id} sec={sec} i={i} t={t} />
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/sections" className="btn btn-outline">{t('viewAll')} <ArrowRight size={16} /></Link>
          </div>
        </section>
      )}

      {/* Trainers */}
      <section style={{ padding: '3rem 0 5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">{t('meetTrainers')} <span className="gradient-text">{t('trainersWord')}</span></h2>
          <div className="divider" />
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('trainersSubtitle')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {TRAINERS_STATIC.map((tr, i) => (
            <div key={i} className={`animate-fade-up delay-${i + 1}`} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'var(--card)', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='var(--shadow-sm)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                <img src={tr.img} alt={tr.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.target.style.transform='scale(1.07)'}
                  onMouseLeave={e => e.target.style.transform='scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,26,1) 0%, transparent 50%)' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{tr.name}</h3>
                <p style={{ color: 'var(--primary-light)', fontSize: '0.875rem', marginBottom: '1rem' }}>{tr.sport}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⭐ <strong style={{ color: 'var(--text)' }}>{tr.rating}</strong> {t('rating')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🏋️ <strong style={{ color: 'var(--text)' }}>{tr.sessions}</strong> {t('sessionsCount')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 0 6rem' }}>
        <div style={{ padding: '4rem 3rem', borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(244,63,94,0.15))', border: '1px solid rgba(99,102,241,0.3)', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
            {t('ctaTitle1')} <span className="gradient-text">{t('ctaHighlight')}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>{t('ctaSubtitle')}</p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>{t('getStarted')}</Link>
        </div>
      </section>
    </div>
  );
};

const SectionPreviewCard = ({ sec, i, t }) => (
  <div className={`animate-fade-up delay-${i + 1}`} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.3s, box-shadow 0.3s' }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.4)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
  >
    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
      <img src={sec.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'} alt={sec.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
        onMouseEnter={e => e.target.style.transform='scale(1.05)'}
        onMouseLeave={e => e.target.style.transform='scale(1)'}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,26,0.9) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{sec.name}</h3>
      </div>
    </div>
    <div style={{ padding: '1.25rem', background: 'var(--card)' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{sec.description}</p>
      <Link to="/schedule" style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {t('bookSession')} <ArrowRight size={14} />
      </Link>
    </div>
  </div>
);

export default Home;
