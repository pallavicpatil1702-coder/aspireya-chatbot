import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const MyReports = () => {
  const navigate = useNavigate();

  return (
    <div className="report-not-found-container" style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div className="not-found-card" style={{ background: 'var(--color-surface, #ffffff)', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '24px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div className="error-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary, #2563eb)', marginBottom: '24px' }}>
          <FileText size={32} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary, #111827)', marginBottom: '16px' }}>
          My Reports
        </h2>
        <p style={{ color: 'var(--color-text-secondary, #4b5563)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
          This feature is coming next.
        </p>
        <p style={{ color: 'var(--color-text-secondary, #4b5563)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Your saved reports will appear here.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--color-primary, #2563eb)', color: '#ffffff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyReports;
