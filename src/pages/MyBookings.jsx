import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLang();

  useEffect(() => {
    api.get('/bookings/me')
      .then(r => setBookings(r.data))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="section-title animate-fade-up"><span className="gradient-text">{t('myBookingsTitle')}</span></h1>
        <div className="divider" />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('myBookingsSubtitle')}</p>
      </div>
      <ErrorAlert message={error} />
      {bookings.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('noBookings')}</p>
          <a href="/schedule" className="btn btn-primary">{t('browseSchedule')}</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div key={booking._id} className="card animate-fade-up stack-on-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <span className="badge badge-student" style={{ marginBottom: '0.25rem' }}>{booking.training?.section?.name}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>Training Session</h3>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {[{ icon: <Calendar size={14} />, text: booking.training?.date },
                    { icon: <Clock size={14} />, text: booking.training?.time },
                    { icon: <User size={14} />, text: booking.training?.trainer?.name }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--primary-light)' }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ color: 'var(--accent2)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                {t('confirmed')} <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
