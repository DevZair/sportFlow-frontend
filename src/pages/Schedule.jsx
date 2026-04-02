import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import TrainingCard from '../components/TrainingCard';

const Schedule = () => {
  const [trainings, setTrainings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { userInfo } = useContext(AuthContext);
  const { t } = useLang();
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, [userInfo]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: td } = await api.get('/trainings?available=true');
      setTrainings(td);
      if (userInfo?.role === 'student') {
        const { data: bd } = await api.get('/bookings/me');
        setMyBookings(bd.map(b => b.training._id));
      }
    } catch {
      setError(t('scheduleTitle'));
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (trainingId) => {
    if (!userInfo) { navigate('/register'); return; }
    try {
      setLoadingBookings(prev => ({ ...prev, [trainingId]: true }));
      setError(''); setSuccess('');
      await api.post('/bookings', { trainingId });
      setSuccess(t('bookedSuccess'));
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    } finally {
      setLoadingBookings(prev => ({ ...prev, [trainingId]: false }));
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="bg-orb bg-orb-2" />
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="section-title animate-fade-up">{t('scheduleTitle').split(' ')[0]} <span className="gradient-text">{t('scheduleTitle').split(' ').slice(1).join(' ')}</span></h1>
        <div className="divider" />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('scheduleSubtitle')}</p>
      </div>
      <ErrorAlert message={error} />
      {success && (
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontWeight: 500 }}>
          {success}
        </div>
      )}
      {trainings.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('noTrainings')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {trainings.map((tr, i) => (
            <div key={tr._id} className={`animate-fade-up delay-${(i % 4) + 1}`}>
              <TrainingCard training={tr} onBook={handleBook} isBooked={myBookings.includes(tr._id)} userInfo={userInfo} t={t} isBookingLoading={loadingBookings[tr._id]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
