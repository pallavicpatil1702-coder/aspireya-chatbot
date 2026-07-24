import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const ReportErrorState = ({ error, onRetry }) => {
  const navigate = useNavigate();

  return (
    <div className="report-not-found-container" style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div className="not-found-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div className="error-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#ef4444', marginBottom: '24px' }}>
          <AlertTriangle size={32} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginBottom: '16px' }}>Request Failed</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
          {error || "An error occurred while compiling your career intelligence report."}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {onRetry && (
            <button 
              className="btn btn-primary"
              onClick={onRetry}
              style={{ width: '100%', padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
            >
              Retry Loading
            </button>
          )}
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)', fontWeight: '600', cursor: 'pointer' }}
          >
            Go back to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportErrorState;
