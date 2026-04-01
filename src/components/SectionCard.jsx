import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { getSectionImage } from '../pages/Home';

const SectionCard = ({ section, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { t } = useLang();
  const img = getSectionImage(section.name);

  return (
    <div style={{
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.03)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; }}
    >
      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
        <img src={img} alt={section.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.target.style.transform='scale(1.08)'}
          onMouseLeave={e => e.target.style.transform='scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,26,0.9) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{section.name}</h3>
        </div>
      </div>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', flex: 1 }}>
          {section.description}
        </p>
        {isAdmin ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => onEdit(section)} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>{t('update')}</button>
            <button onClick={() => onDelete(section._id)} className="btn btn-danger" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>{t('cancel')}</button>
          </div>
        ) : (
          <button onClick={() => navigate('/schedule')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {t('bookSession')} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionCard;
