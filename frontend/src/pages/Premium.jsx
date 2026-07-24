import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Sparkles, 
  Shield, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Cpu, 
  Dna, 
  Target, 
  Globe, 
  FileText, 
  Share2, 
  Lock, 
  HelpCircle, 
  Star, 
  Award,
  AlertCircle
} from 'lucide-react';

const Premium = () => {
  const navigate = useNavigate();
  const [isPremiumUnlocked] = useState(() => {
    // Temporary localStorage flag for development.
    // Later to be replaced by the payment status from Firestore after Razorpay integration.
    return localStorage.getItem('aspireya_premium_unlocked') === 'true';
  });

  useEffect(() => {
    if (isPremiumUnlocked) {
      navigate('/report/premium');
    }
  }, [isPremiumUnlocked, navigate]);

  // Simulated Payment directly unlocks Premium
  const handleProceedToPayment = () => {
    localStorage.setItem('aspireya_premium_unlocked', 'true');
    navigate('/report/premium');
  };

  const premiumFeatures = [
    { 
      title: "Salary Potential Analysis", 
      desc: "Estimate your earning potential today and in the future based on industry data.",
      icon: <DollarSign size={22} style={{ color: 'var(--color-primary)' }} /> 
    },
    { 
      title: "Future Demand Score", 
      desc: "Know how your career will grow over the next decade with growth projections.",
      icon: <TrendingUp size={22} style={{ color: 'var(--color-primary)' }} /> 
    },
    { 
      title: "AI Automation Risk", 
      desc: "Understand how AI and technological disruptions may affect your chosen profession.",
      icon: <Cpu size={22} style={{ color: 'var(--color-primary)' }} /> 
    },
    { 
      title: "Career DNA Analysis", 
      desc: "Discover your complete personality compatibility and find your ideal work environment.",
      icon: <Dna size={22} style={{ color: 'var(--color-primary)' }} /> 
    },
    { 
      title: "Skill Gap Analysis", 
      desc: "Identify the critical skill gaps you need to bridge with a customized learning path.",
      icon: <Target size={22} style={{ color: 'var(--color-primary)' }} /> 
    },
    { 
      title: "Global Career Opportunities", 
      desc: "Explore international possibilities and relocation compatibility for target fields.",
      icon: <Globe size={22} style={{ color: 'var(--color-primary)' }} /> 
    },
    { 
      title: "Premium PDF Report", 
      desc: "Download a beautifully formatted, multi-page professional PDF report for offline use.",
      icon: <FileText size={22} style={{ color: 'var(--color-primary)' }} /> 
    },
    { 
      title: "Share Career Report", 
      desc: "Instantly share your secure, interactive report link with mentors, teachers, and parents.",
      icon: <Share2 size={22} style={{ color: 'var(--color-primary)' }} /> 
    }
  ];

  const faqs = [
    {
      q: "Will I lose my Free Report?",
      a: "No. Your Free Report will always remain fully available. Upgrading to Premium simply unlocks additional deep-dive intelligence sections."
    },
    {
      q: "Can I download my report?",
      a: "Only Premium users can download the complete multi-page, formatted PDF report to save, print, or attach to applications."
    },
    {
      q: "Is this a one-time payment?",
      a: "Yes. Premium is unlocked with a single, one-time payment of ₹99. There are no recurring fees or hidden subscription charges."
    },
    {
      q: "Will more Premium features be added?",
      a: "Yes. Any future updates, enhancements, and additional premium analysis modules will automatically become available to all existing Premium users at no extra cost."
    }
  ];

  // ==========================================
  // UNLOCKED VIEW: PROFESSIONAL 5-PAGE REPORT
  // ==========================================
  if (isPremiumUnlocked) {
    return null;
  }

  // ==========================================
  // LOCKED VIEW: SaaS PREMIUM UPGRADE LANDING
  // ==========================================
  return (
    <div className="premium-page-container">
      <style>{`
        /* Global & Theme Settings */
        .premium-page-container {
          background-color: #f8fafc;
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          width: 100%;
          padding: 32px 16px 80px 16px;
          box-sizing: border-box;
          color: #0f172a;
        }

        .premium-wrapper {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Top Header Back Navigation */
        .premium-top-nav {
          display: flex;
          align-items: center;
          margin-bottom: 32px;
        }

        .btn-top-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 10px 20px;
          border-radius: 12px;
          color: #475569;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .btn-top-back:hover {
          color: var(--color-primary);
          border-color: rgba(23, 39, 91, 0.2);
          box-shadow: 0 4px 12px rgba(23, 39, 91, 0.04);
          transform: translateX(-2px);
        }

        /* Layout Headings */
        .section-header {
          text-align: center;
          margin-bottom: 48px;
          padding: 0 16px;
        }

        .section-title {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .section-subtitle {
          font-size: 1.05rem;
          color: #475569;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* Section 1: Hero Card */
        .premium-hero-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 32px;
          padding: 56px 40px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(23, 39, 91, 0.06);
          color: var(--color-primary);
          border: 1px solid rgba(23, 39, 91, 0.15);
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(23, 39, 91, 0.02);
        }

        .hero-title {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1.15;
          color: #0f172a;
          margin: 0 0 18px 0;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: #475569;
          max-width: 680px;
          margin: 0 auto 36px auto;
          line-height: 1.6;
        }

        .btn-payment-primary {
          background: var(--color-accent-gradient);
          color: #ffffff;
          border: none;
          padding: 16px 36px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 18px rgba(23, 39, 91, 0.35);
        }

        .btn-payment-primary:hover {
          background: var(--color-accent-gradient);
          filter: brightness(1.1);
          box-shadow: 0 6px 24px rgba(23, 39, 91, 0.5);
          transform: translateY(-1px);
        }

        .payment-helper-text {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 10px;
          display: block;
          font-weight: 500;
        }

        /* Trust Statement */
        .trust-statement {
          font-size: 0.86rem;
          color: #64748b;
          margin-top: 24px;
          font-weight: 500;
        }

        /* Trust Badges Row */
        .trust-badges-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 64px;
        }

        @media (min-width: 768px) {
          .trust-badges-row {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .trust-badge-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 20px;
          border-radius: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.01);
        }

        .trust-badge-icon {
          color: var(--color-primary);
          margin-bottom: 2px;
        }

        .trust-badge-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: #334155;
        }

        /* Section 2: What You'll Unlock Grid */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 80px;
        }

        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-unlock-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-unlock-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.05);
          border-color: rgba(79, 70, 229, 0.25);
        }

        .feature-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(79, 70, 229, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-title-text {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .feature-desc-text {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }

        /* Section 3: Premium Preview */
        .preview-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 80px;
        }

        @media (min-width: 640px) {
          .preview-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .preview-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .preview-card-outer {
          position: relative;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
          height: 240px;
        }

        .preview-blur-content {
          padding: 24px;
          filter: blur(8px);
          pointer-events: none;
          user-select: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preview-dummy-line {
          height: 10px;
          background: #e2e8f0;
          border-radius: 4px;
        }

        .preview-dummy-bar {
          height: 48px;
          background: #f1f5f9;
          border-radius: 12px;
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }

        .preview-label-badge {
          background: #e2e8f0;
          color: #475569;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .preview-lock-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .preview-overlay-text {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }

        /* Section 4: Comparison Table */
        .comparison-table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.01);
          margin-bottom: 80px;
          overflow-x: auto;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 600px;
        }

        .comparison-table th {
          padding: 16px 20px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          border-bottom: 2px solid #f1f5f9;
        }

        .comparison-table td {
          padding: 18px 20px;
          font-size: 0.95rem;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
        }

        .td-center {
          text-align: center;
          width: 120px;
        }

        .icon-check-green {
          color: #10B981;
        }

        .icon-cross-gray {
          color: #94a3b8;
        }

        /* Section 5: Why Upgrade Grid */
        .upgrade-reasons-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 80px;
        }

        @media (min-width: 640px) {
          .upgrade-reasons-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .upgrade-reasons-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .upgrade-reason-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 24px 28px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.005);
        }

        .upgrade-reason-bullet {
          color: #10b981;
          background: rgba(16, 185, 129, 0.08);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .upgrade-reason-text {
          font-size: 0.96rem;
          font-weight: 700;
          color: #1e293b;
        }

        /* Section 6: FAQ Grid */
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 80px;
        }

        @media (min-width: 768px) {
          .faq-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .faq-item-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 32px;
          border-radius: 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.005);
        }

        .faq-question-text {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .faq-answer-text {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }

        /* Section 7: Final CTA Card */
        .final-cta-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 32px;
          padding: 56px 40px;
          text-align: center;
          box-shadow: 0 15px 35px rgba(0,0,0,0.015);
          margin-bottom: 80px;
        }

        .price-row-checkout {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .price-label-cta {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-num-cta {
          font-size: 3.2rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -1px;
        }

        .price-crossed-cta {
          font-size: 1.4rem;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 600;
        }

        /* Footer Branding */
        .premium-footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 36px;
          text-align: center;
        }

        .footer-branding-title {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          color: #334155;
          margin-bottom: 4px;
        }

        .footer-branding-subtitle {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0;
        }
      `}</style>

      <div className="premium-wrapper">
        
        {/* Top Header Navigation */}
        <div className="premium-top-nav">
          <button className="btn-top-back" onClick={() => navigate('/report')}>
            <ArrowLeft size={16} />
            <span>Back to Free Report</span>
          </button>
        </div>

        {/* Hero Section */}
        <motion.div 
          className="premium-hero-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="hero-badge-pill">
            <Star size={12} fill="var(--color-primary)" />
            <span>Premium</span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span>Launch Offer</span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span>₹99 Only</span>
          </div>

          <h1 className="hero-title">Unlock Your Complete Career Intelligence Report</h1>
          <p className="hero-subtitle">
            Your assessment is complete. Now unlock deeper AI-powered career insights that most students never discover.
          </p>

          <button className="btn-payment-primary" onClick={handleProceedToPayment}>
            <CreditCard size={18} />
            <span>Proceed to Payment</span>
          </button>
          <span className="payment-helper-text">Payment gateway will be available in the next update.</span>

          <p className="trust-statement">
            🔐 Secure & Instant upgrade options. Refund-friendly policy.
          </p>
        </motion.div>

        {/* Trust Badges Row */}
        <div className="trust-badges-row">
          <div className="trust-badge-item">
            <Sparkles size={20} className="trust-badge-icon" />
            <span className="trust-badge-text">AI Powered</span>
          </div>
          <div className="trust-badge-item">
            <Shield size={20} className="trust-badge-icon" />
            <span className="trust-badge-text">Secure Platform</span>
          </div>
          <div className="trust-badge-item">
            <Award size={20} className="trust-badge-icon" />
            <span className="trust-badge-text">Professional Report</span>
          </div>
          <div className="trust-badge-item">
            <CreditCard size={20} className="trust-badge-icon" />
            <span className="trust-badge-text">Instant Access</span>
          </div>
        </div>

        {/* Section 2: What You'll Unlock */}
        <div className="section-header">
          <h2 className="section-title">What You'll Unlock</h2>
          <p className="section-subtitle">
            Get access to highly specific, tailored career indicators designed to help you plan your vocational path accurately.
          </p>
        </div>

        <div className="features-grid">
          {premiumFeatures.map((feat, idx) => (
            <div key={idx} className="feature-unlock-card">
              <div className="feature-icon-wrapper">
                {feat.icon}
              </div>
              <div>
                <h3 className="feature-title-text">{feat.title}</h3>
                <p className="feature-desc-text" style={{ marginTop: '8px' }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section 3: Premium Preview */}
        <div className="section-header">
          <h2 className="section-title">Premium Report Preview</h2>
          <p className="section-subtitle">
            Take a look at the comprehensive premium analysis elements waiting to be activated.
          </p>
        </div>

        <div className="preview-grid">
          {/* Card 1 */}
          <div className="preview-card-outer">
            <div className="preview-blur-content">
              <div className="preview-dummy-bar" style={{ background: '#e0e7ff' }}></div>
              <div className="preview-dummy-line" style={{ width: '40%' }}></div>
              <div className="preview-dummy-line" style={{ width: '80%' }}></div>
              <div className="preview-dummy-line" style={{ width: '60%' }}></div>
            </div>
            <div className="preview-overlay">
              <span className="preview-label-badge">Preview Available</span>
              <div className="preview-lock-circle">
                <Lock size={18} />
              </div>
              <span className="preview-overlay-text">Career DNA</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="preview-card-outer">
            <div className="preview-blur-content">
              <div className="preview-dummy-bar" style={{ background: '#f5f3ff' }}></div>
              <div className="preview-dummy-line" style={{ width: '30%' }}></div>
              <div className="preview-dummy-line" style={{ width: '70%' }}></div>
              <div className="preview-dummy-line" style={{ width: '50%' }}></div>
            </div>
            <div className="preview-overlay">
              <span className="preview-label-badge">Preview Available</span>
              <div className="preview-lock-circle">
                <Lock size={18} />
              </div>
              <span className="preview-overlay-text">Salary Potential</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="preview-card-outer">
            <div className="preview-blur-content">
              <div className="preview-dummy-bar" style={{ background: '#ecfdf5' }}></div>
              <div className="preview-dummy-line" style={{ width: '50%' }}></div>
              <div className="preview-dummy-line" style={{ width: '90%' }}></div>
              <div className="preview-dummy-line" style={{ width: '40%' }}></div>
            </div>
            <div className="preview-overlay">
              <span className="preview-label-badge">Preview Available</span>
              <div className="preview-lock-circle">
                <Lock size={18} />
              </div>
              <span className="preview-overlay-text">Future Demand</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="preview-card-outer">
            <div className="preview-blur-content">
              <div className="preview-dummy-bar" style={{ background: '#fffbeb' }}></div>
              <div className="preview-dummy-line" style={{ width: '45%' }}></div>
              <div className="preview-dummy-line" style={{ width: '80%' }}></div>
              <div className="preview-dummy-line" style={{ width: '55%' }}></div>
            </div>
            <div className="preview-overlay">
              <span className="preview-label-badge">Preview Available</span>
              <div className="preview-lock-circle">
                <Lock size={18} />
              </div>
              <span className="preview-overlay-text">AI Risk</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="preview-card-outer">
            <div className="preview-blur-content">
              <div className="preview-dummy-bar" style={{ background: '#fff1f2' }}></div>
              <div className="preview-dummy-line" style={{ width: '60%' }}></div>
              <div className="preview-dummy-line" style={{ width: '75%' }}></div>
              <div className="preview-dummy-line" style={{ width: '45%' }}></div>
            </div>
            <div className="preview-overlay">
              <span className="preview-label-badge">Preview Available</span>
              <div className="preview-lock-circle">
                <Lock size={18} />
              </div>
              <span className="preview-overlay-text">Skill Gap</span>
            </div>
          </div>
        </div>

        {/* Section 4: Free vs Premium */}
        <div className="section-header">
          <h2 className="section-title">Free vs Premium Comparison</h2>
          <p className="section-subtitle">
            Compare plans to choose the diagnostic level that matches your career expectations.
          </p>
        </div>

        <div className="comparison-table-card">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="td-center">Free</th>
                <th className="td-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Career Match Analysis</td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>AI Insights</td>
                <td className="td-center"><span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>Basic</span></td>
                <td className="td-center"><span style={{ fontSize: '0.86rem', color: 'var(--color-primary)', fontWeight: 700 }}>Advanced</span></td>
              </tr>
              <tr>
                <td>Report Pages</td>
                <td className="td-center"><span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>2 Pages</span></td>
                <td className="td-center"><span style={{ fontSize: '0.86rem', color: 'var(--color-primary)', fontWeight: 700 }}>5 Pages</span></td>
              </tr>
              <tr>
                <td>Career Intelligence</td>
                <td className="td-center"><span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>Basic</span></td>
                <td className="td-center"><span style={{ fontSize: '0.86rem', color: 'var(--color-primary)', fontWeight: 700 }}>Complete</span></td>
              </tr>
              <tr>
                <td>Strengths Assessment</td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>Improvement Areas Advice</td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>Salary Potential</td>
                <td className="td-center"><X size={18} className="icon-cross-gray" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>Future Demand Score</td>
                <td className="td-center"><X size={18} className="icon-cross-gray" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>AI Automation Risk</td>
                <td className="td-center"><X size={18} className="icon-cross-gray" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>Career DNA Profiles</td>
                <td className="td-center"><X size={18} className="icon-cross-gray" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>Skill Gap Analysis</td>
                <td className="td-center"><X size={18} className="icon-cross-gray" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>Global Opportunities</td>
                <td className="td-center"><X size={18} className="icon-cross-gray" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>Premium PDF Format</td>
                <td className="td-center"><X size={18} className="icon-cross-gray" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
              <tr>
                <td>Share Report Link</td>
                <td className="td-center"><X size={18} className="icon-cross-gray" /></td>
                <td className="td-center"><Check size={18} className="icon-check-green" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 5: Why Upgrade */}
        <div className="section-header">
          <h2 className="section-title">Why Upgrade?</h2>
          <p className="section-subtitle">
            Take command of your professional decisions with precision.
          </p>
        </div>

        <div className="upgrade-reasons-grid">
          <div className="upgrade-reason-card">
            <div className="upgrade-reason-bullet">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="upgrade-reason-text">Make smarter career decisions</span>
          </div>

          <div className="upgrade-reason-card">
            <div className="upgrade-reason-bullet">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="upgrade-reason-text">Understand your earning potential</span>
          </div>

          <div className="upgrade-reason-card">
            <div className="upgrade-reason-bullet">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="upgrade-reason-text">Prepare for AI-driven industries</span>
          </div>

          <div className="upgrade-reason-card">
            <div className="upgrade-reason-bullet">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="upgrade-reason-text">Learn high-income skills</span>
          </div>

          <div className="upgrade-reason-card" style={{ gridColumn: 'span 1' }}>
            <div className="upgrade-reason-bullet">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="upgrade-reason-text">Deeper AI career insights</span>
          </div>
        </div>

        {/* Section 6: FAQ */}
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Clear responses to common questions about our Premium offering.
          </p>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item-card">
              <h3 className="faq-question-text">{faq.q}</h3>
              <p className="faq-answer-text">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Section 7: Final CTA */}
        <div className="final-cta-card">
          <h2 style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.5px' }}>
            Ready to Activate Your Report?
          </h2>

          <div className="price-row-checkout">
            <span className="price-label-cta">Launch Offer</span>
            <span className="price-num-cta">₹99</span>
            <span className="price-crossed-cta">₹299</span>
          </div>

          <button className="btn-payment-primary" onClick={handleProceedToPayment}>
            <CreditCard size={18} />
            <span>Proceed to Payment</span>
          </button>
          <span className="payment-helper-text">Payment gateway will be available in the next update.</span>
        </div>

        {/* Footer Branding */}
        <footer className="premium-footer">
          <div className="footer-branding-title">Built with ❤️ by Aspireya AI</div>
          <p className="footer-branding-subtitle">
            Helping students make smarter career decisions with AI.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Premium;
