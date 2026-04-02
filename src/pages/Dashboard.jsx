import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import BookingModal from '../components/BookingModal';
import { Edit2, Trash2, Users, ClipboardCheck } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sections');
  const [sections, setSections] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditingSection, setIsEditingSection] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDesc, setSectionDesc] = useState('');
  const [sectionImage, setSectionImage] = useState('');
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);

  const [isEditingTraining, setIsEditingTraining] = useState(false);
  const [isSubmittingTraining, setIsSubmittingTraining] = useState(false);
  const [trainingId, setTrainingId] = useState(null);
  const [trainingSectionId, setTrainingSectionId] = useState('');
  const [trainingDays, setTrainingDays] = useState([]);
  const [trainingTime, setTrainingTime] = useState('');
  const [trainingMax, setTrainingMax] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [currentTrainingName, setCurrentTrainingName] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, tRes] = await Promise.all([api.get('/sections'), api.get('/trainings')]);
      setSections(sRes.data);
      setTrainings(tRes.data);
    } catch { setError('Failed to load data'); }
    finally { setLoading(false); }
  };

  // Section CRUD
  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingSection(true);
    try {
      if (isEditingSection) await api.put(`/sections/${sectionId}`, { name: sectionTitle, description: sectionDesc, image: sectionImage });
      else await api.post('/sections', { name: sectionTitle, description: sectionDesc, image: sectionImage });
      resetSectionForm(); fetchAll();
    } catch { setError('Failed to save section'); }
    finally { setIsSubmittingSection(false); }
  };
  const handleEditSection = (s) => { setIsEditingSection(true); setSectionId(s._id); setSectionTitle(s.name); setSectionDesc(s.description); setSectionImage(s.image); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDeleteSection = async (id) => { if (window.confirm('Delete?')) { try { await api.delete(`/sections/${id}`); fetchAll(); } catch { setError('Failed to delete'); } } };
  const resetSectionForm = () => { setIsEditingSection(false); setSectionId(null); setSectionTitle(''); setSectionDesc(''); setSectionImage(''); };

  // Training CRUD
  const handleTrainingSubmit = async (e) => {
    e.preventDefault();
    if (trainingDays.length === 0) {
      setError('Please select at least one day');
      return;
    }
    setIsSubmittingTraining(true);
    try {
      const body = { section: trainingSectionId, days: trainingDays, time: trainingTime, maxParticipants: trainingMax };
      if (isEditingTraining) await api.put(`/trainings/${trainingId}`, body);
      else await api.post('/trainings', body);
      resetTrainingForm(); fetchAll();
    } catch { setError('Failed to save training'); }
    finally { setIsSubmittingTraining(false); }
  };
  const handleEditTraining = (tr) => { setIsEditingTraining(true); setTrainingId(tr._id); setTrainingSectionId(tr.section?._id || ''); setTrainingDays(tr.days || []); setTrainingTime(tr.time); setTrainingMax(tr.maxParticipants); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDeleteTraining = async (id) => { if (window.confirm('Delete training?')) { try { await api.delete(`/trainings/${id}`); fetchAll(); } catch { setError('Failed to delete'); } } };
  const resetTrainingForm = () => { setIsEditingTraining(false); setTrainingId(null); setTrainingSectionId(''); setTrainingDays([]); setTrainingTime(''); setTrainingMax(10); };

  const viewBookings = async (training) => {
    try {
      const { data } = await api.get(`/bookings/${training._id}`);
      setCurrentBookings(data);
      setCurrentTrainingName(`${training.section?.name} ${t('at')} ${training.time}`);
      setIsModalOpen(true);
    } catch { setError('Failed to load bookings'); }
  };

  if (loading) return <Loader />;

  const tabStyle = (tab) => ({
    padding: '0.875rem 0.5rem', lineHeight: 1,
    borderBottom: `2px solid ${activeTab === tab ? 'var(--primary)' : 'transparent'}`,
    color: activeTab === tab ? 'var(--primary-light)' : 'var(--text-muted)',
    fontWeight: activeTab === tab ? 600 : 500,
    background: 'none', fontSize: '0.95rem', transition: 'all 0.2s',
  });

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--text-muted)' };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title animate-fade-up">{t('dashboardTitle').split(' ')[0]} <span className="gradient-text">{t('dashboardTitle').split(' ').slice(1).join(' ')}</span></h1>
        <div className="divider" />
        <p style={{ color: 'var(--text-muted)' }}>{t('dashboardSubtitle')}</p>
      </div>

      <ErrorAlert message={error} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('sections')} style={tabStyle('sections')}>{t('sectionsTab')}</button>
        <button onClick={() => setActiveTab('trainings')} style={tabStyle('trainings')}>{t('trainingsTab')}</button>
      </div>

      {activeTab === 'sections' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>{isEditingSection ? t('editSection') : t('createSection')}</h3>
            <form onSubmit={handleSectionSubmit}>
              <div className="form-group">
                <label style={labelStyle}>{t('nameLabel')}</label>
                <input style={inputStyle} value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Image URL</label>
                <input style={inputStyle} type="url" value={sectionImage} onChange={e => setSectionImage(e.target.value)} required placeholder="https://..." />
              </div>
              <div className="form-group">
                <label style={labelStyle}>{t('descLabel')}</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows="4" value={sectionDesc} onChange={e => setSectionDesc(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={isSubmittingSection} className="btn btn-primary" style={{ flex: 1, opacity: isSubmittingSection ? 0.7 : 1 }}>
                  {isSubmittingSection ? t('loading') : (isEditingSection ? t('update') : t('create'))}
                </button>
                {isEditingSection && <button type="button" onClick={resetSectionForm} className="btn btn-outline" style={{ flex: 1 }}>{t('cancel')}</button>}
              </div>
            </form>
          </div>

          {/* Section List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {sections.map(sec => (
              <div key={sec._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{sec.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>{sec.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEditSection(sec)} className="btn-icon"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteSection(sec._id)} className="btn-icon" style={{ color: 'var(--accent)' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>{isEditingTraining ? t('editTraining') : t('scheduleTraining')}</h3>
            <form onSubmit={handleTrainingSubmit}>
              <div className="form-group">
                <label style={labelStyle}>{t('sectionLabel')}</label>
                <select style={inputStyle} value={trainingSectionId} onChange={e => setTrainingSectionId(e.target.value)} required>
                  <option value="">{t('selectSection')}</option>
                  {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={labelStyle}>{t('dateLabel')}</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                    <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', border: trainingDays.includes(day) ? '1px solid var(--primary-light)' : '1px solid transparent' }}>
                      <input 
                        type="checkbox" 
                        checked={trainingDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) setTrainingDays([...trainingDays, day]);
                          else setTrainingDays(trainingDays.filter(d => d !== day));
                        }}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: trainingDays.includes(day) ? 'var(--primary-light)' : 'var(--text-muted)' }}>{t(day)}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label style={labelStyle}>{t('timeLabel')}</label>
                <input type="time" style={inputStyle} value={trainingTime} onChange={e => setTrainingTime(e.target.value)} required />
              </div>
              <div className="form-group">
                <label style={labelStyle}>{t('maxParLabel')}</label>
                <input type="number" style={inputStyle} value={trainingMax} onChange={e => setTrainingMax(Number(e.target.value))} required min="1" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={isSubmittingTraining} className="btn btn-primary" style={{ flex: 1, opacity: isSubmittingTraining ? 0.7 : 1 }}>
                  {isSubmittingTraining ? t('loading') : (isEditingTraining ? t('update') : t('schedule'))}
                </button>
                {isEditingTraining && <button type="button" onClick={resetTrainingForm} className="btn btn-outline" style={{ flex: 1 }}>{t('cancel')}</button>}
              </div>
            </form>
          </div>

          {/* Training List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {trainings.map(tr => (
              <div key={tr._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div>
                  <span className="badge badge-trainer" style={{ marginBottom: '0.3rem' }}>{tr.section?.name}</span>
                  <div style={{ fontWeight: 600 }}>{tr.days?.map(d => t(d)).join(', ')} {t('at')} {tr.time}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={() => navigate(`/attendance/${tr._id}`)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ClipboardCheck size={14} /> {t('attendancePage')}
                  </button>
                  <button onClick={() => viewBookings(tr)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={14} /> {t('viewStudents')}
                  </button>
                  <button onClick={() => handleEditTraining(tr)} className="btn-icon"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteTraining(tr._id)} className="btn-icon" style={{ color: 'var(--accent)' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} bookings={currentBookings} trainingName={currentTrainingName} t={t} />
    </div>
  );
};

export default Dashboard;
