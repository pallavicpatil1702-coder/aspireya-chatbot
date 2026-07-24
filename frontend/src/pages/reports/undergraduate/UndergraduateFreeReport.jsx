import React from 'react';
import UpgradeCTA from '../shared/UpgradeCTA.jsx';
import PremiumTeaserCard from '../shared/PremiumTeaserCard.jsx';
import { Compass, Briefcase, Award } from 'lucide-react';
import CareerMatchCard from '../shared/CareerMatchCard.jsx';

const UndergraduateFreeReport = ({ 
  careerPaths = [], 
  internships = [], 
  certifications = [], 
  onUpgrade,
  hasPremium = false
}) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* 1. Recommended Career Paths (Free) */}
      <div className="w-full">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <Compass size={20} className="text-indigo-600" />
          <span>Recommended Career Paths</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {careerPaths.slice(0, 3).map((rec, idx) => (
            <CareerMatchCard
              key={idx}
              rank={idx + 1}
              title={rec.career}
              matchPercentage={rec.matchPercentage}
              tags={["Target Career"]}
              badgeText="Career Match"
              scoreColor="var(--report-indigo-start)"
            />
          ))}
        </div>
      </div>

      {/* 2. Internship Roles & Target Certifications (Free) */}
      <div className="report-equal-cols" style={{ marginTop: '32px' }}>
        {/* Internships */}
        <div className="report-card-premium" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef2ff', padding: '10px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
              <Briefcase size={20} color="var(--report-indigo-start)" />
            </div>
            <h3 className="report-heading-3" style={{ margin: 0, fontWeight: 800 }}>Recommended Internships</h3>
          </div>
          
          <div className="report-visual-list">
            {internships.length > 0 ? (
              internships.map((int, idx) => (
                <div key={idx} className="report-visual-item" style={{ transition: 'all 0.2s' }}>
                  <div className="report-visual-icon" style={{ backgroundColor: '#eef2ff', color: 'var(--report-indigo-start)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--report-text-primary)' }}>
                    {int}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--report-text-muted)', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                No internships recommended at this time.
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="report-card-premium" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fffbeb', padding: '10px', borderRadius: '12px', border: '1px solid #fde68a' }}>
              <Award size={20} color="#d97706" />
            </div>
            <h3 className="report-heading-3" style={{ margin: 0, fontWeight: 800 }}>Target Certifications</h3>
          </div>
          
          <div className="report-visual-list">
            {certifications.length > 0 ? (
              certifications.map((cert, idx) => (
                <div key={idx} className="report-visual-item" style={{ transition: 'all 0.2s' }}>
                  <div className="report-visual-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--report-text-primary)' }}>
                    {cert}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--report-text-muted)', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                No certifications recommended at this time.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Locked Premium Insights (Free) */}
      <div className="report-full-width" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--report-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Locked Premium Action Plan:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PremiumTeaserCard 
            title="Detailed Assessment, Skills Analysis & Career Roadmap" 
            sectionType="roadmap" 
          />
        </div>
      </div>

      {/* 4. Upgrade CTA */}
      <UpgradeCTA onUpgrade={onUpgrade} hasPremium={hasPremium} />
    </div>
  );
};

export default UndergraduateFreeReport;
