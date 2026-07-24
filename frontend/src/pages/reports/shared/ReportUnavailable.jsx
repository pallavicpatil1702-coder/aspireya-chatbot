import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const ReportUnavailable = ({ message = "No valid report type could be determined." }) => {
  const navigate = useNavigate();

  return (
    <div className="report-not-found-container" style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div className="not-found-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div className="error-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyCentent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', marginBottom: '24px', justifyContent: 'center' }}>
          <AlertCircle size={32} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '16px' }}>Report Unavailable</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
          {message} Please make sure you have successfully submitted your assessment from the dashboard.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/onboarding')}
            style={{ width: '100%', padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', fontWeight: '600', cursor: 'pointer' }}
          >
            Take Career Assessment
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)', fontWeight: '600', cursor: 'pointer' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUnavailable;
