import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import { Dumbbell, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      login(data);
      navigate(data.role === 'trainer' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="bg-orb bg-orb-2" />
      <div className="glass animate-fade-up" style={{ width: '100%', maxWidth: '440px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', background: 'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', animation: 'pulse-glow 3s ease-in-out infinite' }}>
            <Dumbbell size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('createAccount')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('registerSubtitle')}</p>
        </div>
        <ErrorAlert message={error} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('fullName')}</label>
            <input type="text" className="form-input" placeholder={t('namePlaceholder')} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('emailLabel')}</label>
            <input type="email" className="form-input" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('passwordLabel')}</label>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('iAm')}</label>
            <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">{t('student')}</option>
              <option value="trainer">{t('trainerRole')}</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem', fontSize: '1rem' }} disabled={loading}>
            {loading ? t('creating') : <><span>{t('createBtn')}</span> <ArrowRight size={18} /></>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {t('alreadyHave')}{' '}<Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{t('signIn')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
