import React, { useState, useEffect } from 'react';
import  { useLang } from '../context/LangContext';
import api from '../services/api';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import SectionCard from '../components/SectionCard';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLang();

  useEffect(() => {
    api.get('/sections')
      .then(r => setSections(r.data))
      .catch(() => setError('Failed to load sections'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="bg-orb bg-orb-1" />
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="section-title animate-fade-up"><span className="gradient-text">{t('sectionsTitle')}</span></h1>
        <div className="divider" />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('sectionsPageSubtitle')}</p>
      </div>
      <ErrorAlert message={error} />
      {sections.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('noSections')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {sections.map((sec, i) => (
            <div key={sec._id} className={`animate-fade-up delay-${(i % 4) + 1}`}>
              <SectionCard section={sec} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sections;
