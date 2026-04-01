import React from 'react';
import { X, User, Mail } from 'lucide-react';
import { useLang } from '../context/LangContext';

const BookingModal = ({ isOpen, onClose, bookings, trainingName }) => {
  const { t } = useLang();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', padding: '2rem', margin: '1rem' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t('studentsIn')}: <span style={{ color: 'var(--primary-light)' }}>{trainingName}</span></h2>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {bookings.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>{t('noStudents')}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {bookings.map((booking) => (
              <div key={booking._id} style={{ padding: '0.875rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}>
                  {booking.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{booking.user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                    <Mail size={11} /> {booking.user?.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary">{t('close')}</button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
