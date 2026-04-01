import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import { ArrowLeft, Save, CheckCircle, Clock, XCircle } from 'lucide-react';

const STATUS_OPTIONS = ['present', 'late', 'absent'];

const STATUS_CONFIG = {
  present: { icon: <CheckCircle size={16} />, color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', key: 'present' },
  late:    { icon: <Clock size={16} />,        color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)',  key: 'late' },
  absent:  { icon: <XCircle size={16} />,      color: '#f43f5e', bg: 'rgba(244,63,94,0.15)',  border: 'rgba(244,63,94,0.4)',   key: 'absent' },
};

const AttendancePage = () => {
  const { trainingId } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: { status, reason } }
  const [trainingInfo, setTrainingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, trRes] = await Promise.all([
          api.get(`/attendance/training/${trainingId}`),
          api.get(`/trainings`),
        ]);
        setStudents(attRes.data);

        // Pre-fill existing attendance
        const existing = {};
        attRes.data.forEach(s => {
          existing[s.studentId] = {
            status: s.status || null,
            reason: s.reason || '',
          };
        });
        setAttendance(existing);

        const training = trRes.data.find(tr => tr._id === trainingId);
        if (training) setTrainingInfo(training);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [trainingId]);

  const setStatus = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status, reason: status !== 'absent' && status !== 'late' ? '' : prev[studentId]?.reason || '' },
    }));
  };

  const setReason = (studentId, reason) => {
    setAttendance(prev => ({ ...prev, [studentId]: { ...prev[studentId], reason } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(''); setSuccess('');
    try {
      const requests = students
        .filter(s => attendance[s.studentId]?.status)
        .map(s => api.post('/attendance', {
          studentId: s.studentId,
          trainingId,
          status: attendance[s.studentId].status,
          reason: attendance[s.studentId].reason || '',
        }));
      await Promise.all(requests);
      setSuccess(t('savedSuccess'));
    } catch {
      setError('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const markedCount = students.filter(s => attendance[s.studentId]?.status).length;

  return (
    <div>
      <div className="bg-orb bg-orb-1" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ padding: '0.6rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>
            {t('attendanceTitle')} — <span className="gradient-text">{trainingInfo?.section?.name || '...'}</span>
          </h1>
          {trainingInfo && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {trainingInfo.date} {t('at')} {trainingInfo.time} · {t('trainer')}: {trainingInfo.trainer?.name}
            </p>
          )}
        </div>
      </div>

      <ErrorAlert message={error} />

      {success && (
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontWeight: 500 }}>
          {success}
        </div>
      )}

      {/* Progress bar */}
      {students.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>{t('attendanceTitle')}</span>
            <span>{markedCount} / {students.length}</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${students.length ? (markedCount / students.length) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '99px', transition: 'width 0.4s' }} />
          </div>
        </div>
      )}

      {students.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>{t('noBookedStudents')}</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {students.map((student, i) => {
              const current = attendance[student.studentId] || {};
              return (
                <div key={student.studentId} className={`animate-fade-up delay-${(i % 4) + 1}`} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${current.status ? STATUS_CONFIG[current.status].border : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '1.25rem 1.5rem',
                  transition: 'border-color 0.3s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    {/* Student info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                      </div>
                    </div>

                    {/* Status buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {STATUS_OPTIONS.map(s => {
                        const cfg = STATUS_CONFIG[s];
                        const active = current.status === s;
                        return (
                          <button key={s} onClick={() => setStatus(student.studentId, s)} style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1rem', borderRadius: '0.5rem',
                            border: `1px solid ${active ? cfg.border : 'rgba(255,255,255,0.1)'}`,
                            background: active ? cfg.bg : 'transparent',
                            color: active ? cfg.color : 'var(--text-muted)',
                            fontWeight: active ? 600 : 400,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                          }}>
                            {cfg.icon} {t(s)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reason input for late or absent */}
                  {(current.status === 'absent' || current.status === 'late') && (
                    <div style={{ marginTop: '1rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder={t('reasonPlaceholder')}
                        value={current.reason || ''}
                        onChange={e => setReason(student.studentId, e.target.value)}
                        style={{ fontSize: '0.875rem' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSave} disabled={saving || markedCount === 0} className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {saving ? t('saving') : t('saveAttendance')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePage;
