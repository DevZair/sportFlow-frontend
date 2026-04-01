import React from 'react';
import { Calendar, Clock, Users, User, LogIn } from 'lucide-react';
import { getSectionImage } from '../pages/Home';
import { useLang } from '../context/LangContext';

const TrainingCard = ({ training, onBook, isAdmin, onDelete, isBooked, userInfo }) => {
  const { t } = useLang();
  const img = getSectionImage(training.section?.name || '');

  return (
    <div style={{
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.03)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
    >
      <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
        <img src={img} alt={training.section?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.target.style.transform='scale(1.08)'}
          onMouseLeave={e => e.target.style.transform='scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,26,0.9) 0%, rgba(10,10,26,0.3) 100%)' }} />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
          <span className="badge badge-student">{training.section?.name || 'Training'}</span>
        </div>
        {isAdmin && (
          <button onClick={() => onDelete(training._id)} className="btn btn-danger" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
            Delete
          </button>
        )}
      </div>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          <InfoRow icon={<Calendar size={14} />} text={training.date} />
          <InfoRow icon={<Clock size={14} />} text={training.time} />
          <InfoRow icon={<User size={14} />} text={training.trainer?.name || '—'} />
          <InfoRow icon={<Users size={14} />} text={`${t('maxParticipants')} ${training.maxParticipants}`} />
        </div>

        {!isAdmin && (
          <button
            onClick={() => onBook(training._id)}
            disabled={isBooked}
            className={isBooked ? 'btn btn-outline' : 'btn btn-primary'}
            style={{ width: '100%', opacity: isBooked ? 0.6 : 1 }}
          >
            {!userInfo && <LogIn size={16} />}
            {isBooked ? t('alreadyBooked') : userInfo ? t('bookNow') : t('loginToBook')}
          </button>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
    <span style={{ color: 'var(--primary-light)' }}>{icon}</span>
    <span>{text}</span>
  </div>
);

export default TrainingCard;
