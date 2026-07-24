import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

/**
 * UndergraduateReportComingSoon renders a professional "Coming Soon" screen.
 * Used when the assessmentType is undergraduate, since the backend data/questions mapping
 * is not yet supported end-to-end.
 */
const UndergraduateReportComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="report-not-found-container" style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div className="not-found-card" style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '24px', padding: '48px', maxWidth: '550px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div className="error-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfeff', color: '#0891b2', marginBottom: '24px' }}>
          <Calendar size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#164e63', marginBottom: '16px' }}>
          Undergraduate Assessment Coming Soon
        </h2>
        <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
          We are currently finalizing the specialized undergraduate question sets, core matching services, and university alignment matrices on our backend. 
          <br /><br />
          This feature will be rolled out soon! In the meantime, you can explore the other active assessments (Class 8-10, Class 11-12, or Professional).
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/onboarding')}
            style={{ width: '100%', padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#0891b2', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
          >
            Take Other Assessments
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '12px 24px', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#4b5563', fontWeight: '600', cursor: 'pointer' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UndergraduateReportComingSoon;
