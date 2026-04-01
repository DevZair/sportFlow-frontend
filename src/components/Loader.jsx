import React from 'react';

const Loader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', gap: '1rem' }}>
    <div className="spinner" />
    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</p>
  </div>
);

export default Loader;
