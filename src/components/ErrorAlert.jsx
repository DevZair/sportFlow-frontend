import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '1rem 1.25rem',
      background: 'rgba(244,63,94,0.1)',
      border: '1px solid rgba(244,63,94,0.3)',
      borderRadius: 'var(--radius)',
      color: '#fb7185',
      marginBottom: '1.5rem',
      fontSize: '0.9rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      <AlertTriangle size={18} style={{ flexShrink: 0 }} />
      <p>{message}</p>
    </div>
  );
};

export default ErrorAlert;
