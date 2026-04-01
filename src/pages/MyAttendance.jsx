import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import { Calendar, Clock, User, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const STATUS_CONFIG = {
  present: { label: 'present', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: <CheckCircle size={14} /> },
  late:    { label: 'late',    color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)',  icon: <Clock size={14} /> },
  absent:  { label: 'absent',  color: '#f43f5e', bg: 'rgba(244,63,94,0.15)',  border: 'rgba(244,63,94,0.3)',   icon: <XCircle size={14} /> },
};

const MyAttendance = () => {
  const { t } = useLang();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/attendance/me')
      .then(r => setRecords(r.data))
      .catch(() => setError('Failed to load attendance'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const total = records.length;
  const presentCount = records.filter(r => r.status === 'present').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const rate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  const stats = [
    { label: t('totalSessions'), value: total, color: 'var(--primary-light)', icon: <TrendingUp size={22} /> },
    { label: t('attended'), value: presentCount, color: '#10b981', icon: <CheckCircle size={22} /> },
    { label: t('latedSessions'), value: lateCount, color: '#f59e0b', icon: <Clock size={22} /> },
    { label: t('absentSessions'), value: absentCount, color: '#f43f5e', icon: <XCircle size={22} /> },
  ];

  return (
    <div>
      <div className="bg-orb bg-orb-1" />

      <div style={{ marginBottom: '3rem' }}>
        <h1 className="section-title animate-fade-up">
          {t('myAttendanceTitle').split(' ').slice(0, 2).join(' ')}{' '}
          <span className="gradient-text">{t('myAttendanceTitle').split(' ').slice(2).join(' ')}</span>
        </h1>
        <div className="divider" />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('myAttendanceSubtitle')}</p>
      </div>

      <ErrorAlert message={error} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {stats.map((s, i) => (
          <div key={i} className={`glass animate-fade-up delay-${i + 1}`} style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: s.color, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rate bar */}
      {total > 0 && (
        <div className="glass" style={{ padding: '1.25rem 1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>{t('attendanceRate')}</span>
              <span style={{ color: rate >= 80 ? '#10b981' : rate >= 60 ? '#f59e0b' : '#f43f5e', fontWeight: 700 }}>{rate}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${rate}%`, background: rate >= 80 ? 'linear-gradient(90deg,#10b981,#34d399)' : rate >= 60 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#f43f5e,#fb7185)', borderRadius: '99px', transition: 'width 0.6s ease' }} />
            </div>
          </div>
        </div>
      )}

      {/* Records list */}
      {records.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{t('noAttendance')}</p>
          <Link to="/schedule" className="btn btn-primary">{t('browseSchedule')}</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {records.map((rec, i) => {
            const cfg = STATUS_CONFIG[rec.status];
            return (
              <div key={rec._id} className={`animate-fade-up delay-${(i % 4) + 1}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                padding: '1.25rem 1.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${cfg.border}`,
                borderRadius: 'var(--radius)',
                transition: 'background 0.2s',
              }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Section */}
                  <div>
                    <span className="badge badge-student" style={{ marginBottom: '0.25rem' }}>{rec.training?.section?.name}</span>
                  </div>
                  {/* Date/Time */}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                      { icon: <Calendar size={13} />, text: rec.training?.date },
                      { icon: <Clock size={13} />,    text: rec.training?.time },
                      { icon: <User size={13} />,     text: rec.markedBy?.name },
                    ].map((item, j) => item.text ? (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--primary-light)' }}>{item.icon}</span> {item.text}
                      </div>
                    ) : null)}
                  </div>
                  {/* Reason */}
                  {rec.reason && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      💬 {rec.reason}
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: '99px', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 }}>
                  {cfg.icon} {t(rec.status)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAttendance;
