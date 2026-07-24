import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  GraduationCap,
  Check,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Sparkles,
  Loader2
} from 'lucide-react';
import { saveUserProfile } from '../services/api.js';
import careerIllustration from '../assets/career-illustration.png';
import logo from '../assets/logo.png';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasReports, setHasReports] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    mobile: '',
    city: '',
    state: '',
    currentEducation: '',
    classOrQualification: '',
    schoolOrCollege: ''
  });

  const educationOptions = [
    { value: '', label: 'Select current level' },
    { value: 'High School (Class 10)', label: 'High School (Class 10)' },
    { value: 'Higher Secondary (Class 12)', label: 'Higher Secondary (Class 12)' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Undergraduate', label: 'Undergraduate (B.Tech, BSc, BCA, BCom, etc.)' },
    { value: 'Postgraduate', label: 'Postgraduate (M.Tech, MSc, MCA, MBA, etc.)' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Name must be at least 2 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = 'Enter a valid email address';

    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!mobileRegex.test(formData.mobile.trim())) newErrors.mobile = 'Enter a valid 10-digit mobile number';

    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.currentEducation) newErrors.currentEducation = 'Education level is required';
    if (!formData.classOrQualification.trim()) newErrors.classOrQualification = 'Class/Qualification is required';
    if (!formData.schoolOrCollege.trim()) newErrors.schoolOrCollege = 'School/College name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const result = await saveUserProfile(formData);
      
      console.log(`Email: ${formData.email}\nHas Reports: ${result.hasReports}`);
      setHasReports(result.hasReports);
      
      // Wait slightly for a premium, deliberate transition feel
      setTimeout(() => {
        setStep(3);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to submit onboarding data:', error);
      setErrors({ apiError: error.message || 'Failed to save information. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="onboarding-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}>
      {/* Natively designed modular styles using existing design tokens */}
      <style>{`
        .onboarding-page-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          background-color: var(--bg-main);
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .onboarding-grid {
          display: grid;
          grid-template-columns: 1fr;
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
        }
        
        @media (min-width: 1024px) {
          .onboarding-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        /* Left Column / Sidebar */
        .onboarding-sidebar {
          display: none;
          position: relative;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          padding: 48px;
          color: #ffffff;
          overflow: hidden;
          flex-direction: column;
          justify-content: space-between;
        }
        
        @media (min-width: 1024px) {
          .onboarding-sidebar {
            display: flex;
          }
        }
        
        .sidebar-glow-1 {
          position: absolute;
          top: -80px;
          left: -80px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.15);
          filter: blur(80px);
          pointer-events: none;
        }
        
        .sidebar-glow-2 {
          position: absolute;
          bottom: -100px;
          right: -50px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.12);
          filter: blur(90px);
          pointer-events: none;
        }
        
        .sidebar-header {
          position: relative;
          z-index: 10;
        }
        
        .sidebar-logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .logo-box {
          background: #ffffff;
          padding: 6px 12px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .logo-box span {
          background: var(--color-accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }
        
        .sidebar-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 32px;
        }
        
        .illustration-card {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          padding: 8px;
        }
        
        .illustration-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 18px;
        }
        
        .sidebar-title {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1.25;
          margin-top: 12px;
        }
        
        .sidebar-desc {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-top: 12px;
        }
        
        .features-list {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 10px 14px;
          backdrop-filter: blur(8px);
        }
        
        .check-badge {
          background: #ffffff;
          color: #0f172a;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .feature-text {
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
        }
        
        .sidebar-footer {
          position: relative;
          z-index: 10;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        /* Right Column / Form Container */
        .onboarding-main {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
        }
        
        @media (min-width: 640px) {
          .onboarding-main {
            padding: 48px;
          }
        }
        
        .form-card-container {
          width: 100%;
          max-width: 540px;
        }
        
        .logo-header-mobile {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        @media (min-width: 1024px) {
          .logo-header-mobile {
            display: none;
          }
        }
        
        .mobile-logo-text {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .mobile-logo-box {
          background: #ffffff;
          padding: 4px 8px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .mobile-logo-box span {
          background: var(--color-accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          font-size: 0.85rem;
        }
        
        .step-info-mobile {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
        }
        
        .form-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
        }
        
        @media (min-width: 640px) {
          .form-card {
            padding: 40px;
          }
        }
        
        /* Steps Indicators */
        .steps-indicators {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .step-tab {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          border: 2px solid var(--border-light);
          color: var(--text-muted);
          transition: all 0.3s ease;
          background: #ffffff;
          flex-shrink: 0;
        }
        
        .step-tab.active .step-circle {
          border-color: var(--color-primary);
          background: rgba(37, 99, 235, 0.05);
          color: var(--color-primary);
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.1);
        }
        
        .step-tab.completed .step-circle {
          border-color: var(--color-success);
          background: var(--color-success);
          color: #ffffff;
        }
        
        .step-label {
          min-width: 0;
        }
        
        .step-num-text {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          margin: 0;
          font-weight: 700;
        }
        
        .step-tab.active .step-num-text {
          color: var(--color-primary);
        }
        
        .step-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .step-tab.active .step-name {
          color: var(--text-primary);
        }
        
        /* Progress Bar */
        .progress-container {
          width: 100%;
          height: 4px;
          background: #f1f5f9;
          border-radius: 2px;
          margin-bottom: 32px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .form-section-header {
          margin-bottom: 24px;
        }
        
        .form-section-header h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }
        
        .form-section-header p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }
        
        /* Input Controls */
        .form-fields-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .form-group label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-icon-left {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }
        
        .form-input {
          width: 100%;
          height: 44px;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 0.9rem;
          color: var(--text-primary);
          outline: none;
          background: #ffffff;
          transition: all 0.2s ease;
        }
        
        .input-with-icon .form-input {
          padding-left: 42px;
        }
        
        .form-input::placeholder {
          color: var(--text-muted);
        }
        
        .form-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .form-input.error {
          border-color: #ef4444;
        }
        
        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        /* Mobile Input with Code */
        .mobile-input-wrapper {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 10px;
        }
        
        .code-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 14px;
          padding-right: 24px;
          text-align: center;
          cursor: pointer;
        }
        
        /* Row Grid */
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        @media (min-width: 640px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        .error-message {
          font-size: 0.75rem;
          color: #ef4444;
          font-weight: 500;
          margin-top: 4px;
        }
        
        .api-error-card {
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #991b1b;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 0.85rem;
          margin-bottom: 24px;
          font-weight: 500;
        }
        
        /* Footer Actions */
        .form-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
        }
        
        .action-btn {
          height: 46px;
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
        }
        
        .action-btn.primary {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);
        }
        
        .action-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
          filter: brightness(1.05);
        }
        
        .action-btn.secondary {
          background: #ffffff;
          color: var(--text-secondary);
          border: 1px solid var(--border-light);
        }
        
        .action-btn.secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
        }
        
        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .bottom-card-hint {
          text-align: center;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 24px;
        }
      `}</style>

      <div className="onboarding-grid">
        {/* Left Side: Sidebar Panel (Desktop only) */}
        <motion.aside
          className="onboarding-sidebar"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          <div className="sidebar-glow-1"></div>
          <div className="sidebar-glow-2"></div>

          <div className="sidebar-header">
            <div className="sidebar-logo" style={{ background: '#ffffff', padding: '8px 16px', borderRadius: '12px', display: 'inline-flex', width: 'fit-content', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img src={logo} alt="Aspireya Logo" className="sidebar-logo-img" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            </div>
          </div>

          <div className="sidebar-content">
            <div className="illustration-card">
              <motion.img
                src={careerIllustration}
                alt="Aspireya Career Illustration"
                className="illustration-img"
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <div>
              <h1 className="sidebar-title">Start Your Career Journey with Aspireya</h1>
              <p className="sidebar-desc">
                Personalized career guidance, expert mentorship, AI-powered recommendations, internship support, and career planning designed to help students achieve their goals.
              </p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <span className="check-badge">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="feature-text">AI Career Guidance</span>
              </div>
              <div className="feature-item">
                <span className="check-badge">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="feature-text">Personalized Roadmap</span>
              </div>
              <div className="feature-item">
                <span className="check-badge">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="feature-text">Expert Mentorship</span>
              </div>
              <div className="feature-item">
                <span className="check-badge">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="feature-text">Internship Support</span>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <p>© 2026 Aspireya Consulting · Where Clarity Meets Career</p>
          </div>
        </motion.aside>

        {/* Right Side: Form Wizard */}
        <main className="onboarding-main">
          <motion.div
            className="form-card"
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.97
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            transition={{
              duration: 0.6
            }}
          >
            {/* Mobile Header */}
            <div className="logo-header-mobile">
              <img src={logo} alt="Aspireya Logo" className="mobile-logo-img" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
              <span className="step-info-mobile">Step {step} of 2</span>
            </div>

            {/* Main Form Card */}
            <div className="form-card">
              {/* Step Tab Indicators */}
              <div className="steps-indicators">
                <div className={`step-tab ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {step > 1 ? <Check size={16} strokeWidth={3} /> : <User size={16} />}
                  </div>
                  <div className="step-label">
                    <p className="step-num-text">Step 1</p>
                    <p className="step-name">Personal</p>
                  </div>
                </div>

                <div className={`step-tab ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {step > 2 ? <Check size={16} strokeWidth={3} /> : <GraduationCap size={18} />}
                  </div>
                  <div className="step-label">
                    <p className="step-num-text">Step 2</p>
                    <p className="step-name">Education</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar" style={{ width: step === 1 ? '50%' : '100%' }}></div>
              </div>

              {/* API error card if save fails */}
              {errors.apiError && (
                <div className="api-error-card">
                  {errors.apiError}
                </div>
              )}

              {/* Form step transitions using Framer Motion */}
              <AnimatePresence mode="wait">
                {step === 3 ? (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="form-fields-grid"
                    style={{ textAlign: 'center', padding: '20px 0' }}
                  >
                    <div className="form-section-header" style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                        <Check size={32} strokeWidth={3} />
                      </div>
                      <h2>Onboarding Complete!</h2>
                      <p>Your profile has been saved successfully.</p>
                    </div>

                    <div className="form-actions" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      {hasReports ? (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate('/assessment')}
                            className="action-btn primary"
                          >
                            <span>Start New Assessment</span>
                            <ArrowRight size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate('/my-reports')}
                            className="action-btn secondary"
                          >
                            <span>My Reports</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate('/assessment')}
                          className="action-btn primary"
                        >
                          <span>Start Assessment</span>
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleContinue}
                    className="form-fields-grid"
                  >
                    <div className="form-section-header">
                      <h2>Personal Information</h2>
                      <p>Tell us a bit about yourself to get started.</p>
                    </div>

                    {/* Full Name */}
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <div className="input-with-icon">
                        <User size={16} className="input-icon-left" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          placeholder="Jane Doe"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`form-input ${errors.fullName ? 'error' : ''}`}
                        />
                      </div>
                      {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile Number</label>
                      <div className="mobile-input-wrapper">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="form-input code-select"
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+971">+971 (AE)</option>
                          <option value="+61">+61 (AU)</option>
                        </select>
                        <div className="input-with-icon">
                          <Phone size={16} className="input-icon-left" />
                          <input
                            type="text"
                            id="mobile"
                            name="mobile"
                            inputMode="numeric"
                            placeholder="9876543210"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className={`form-input ${errors.mobile ? 'error' : ''}`}
                          />
                        </div>
                      </div>
                      {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                    </div>

                    {/* Email Address */}
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <div className="input-with-icon">
                        <Mail size={16} className="input-icon-left" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-input ${errors.email ? 'error' : ''}`}
                        />
                      </div>
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    {/* City & State Row */}
                    <div className="form-row-2">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <div className="input-with-icon">
                          <MapPin size={16} className="input-icon-left" />
                          <input
                            type="text"
                            id="city"
                            name="city"
                            placeholder="Mumbai"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`form-input ${errors.city ? 'error' : ''}`}
                          />
                        </div>
                        {errors.city && <span className="error-message">{errors.city}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="state">State</label>
                        <div className="input-with-icon">
                          <MapPin size={16} className="input-icon-left" />
                          <input
                            type="text"
                            id="state"
                            name="state"
                            placeholder="Maharashtra"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={`form-input ${errors.state ? 'error' : ''}`}
                          />
                        </div>
                        {errors.state && <span className="error-message">{errors.state}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                      <button
                        type="submit"
                        className="action-btn primary"
                      >
                        <span>Continue</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit}
                    className="form-fields-grid"
                  >
                    <div className="form-section-header">
                      <h2>Educational Details</h2>
                      <p>Provide your current academic qualifications.</p>
                    </div>

                    {/* Current Education dropdown */}
                    <div className="form-group">
                      <label htmlFor="currentEducation">Current Education Level</label>
                      <div className="input-with-icon">
                        <GraduationCap size={16} className="input-icon-left" />
                        <select
                          id="currentEducation"
                          name="currentEducation"
                          value={formData.currentEducation}
                          onChange={handleInputChange}
                          className={`form-input ${errors.currentEducation ? 'error' : ''}`}
                          style={{ appearance: 'none', cursor: 'pointer', paddingRight: '36px', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpath d=\'m6 9 6 6 6-6\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '14px' }}
                        >
                          {educationOptions.map((opt, oIdx) => (
                            <option key={oIdx} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      {errors.currentEducation && <span className="error-message">{errors.currentEducation}</span>}
                    </div>

                    {/* Class/Qualification */}
                    <div className="form-group">
                      <label htmlFor="classOrQualification">Class / Specialization / Qualification</label>
                      <div className="input-with-icon">
                        <Sparkles size={16} className="input-icon-left" />
                        <input
                          type="text"
                          id="classOrQualification"
                          name="classOrQualification"
                          placeholder="e.g. 3rd Year / Sem 5, or Class 12 Science"
                          value={formData.classOrQualification}
                          onChange={handleInputChange}
                          className={`form-input ${errors.classOrQualification ? 'error' : ''}`}
                        />
                      </div>
                      {errors.classOrQualification && <span className="error-message">{errors.classOrQualification}</span>}
                    </div>

                    {/* School / College Name */}
                    <div className="form-group">
                      <label htmlFor="schoolOrCollege">School / College / Institution Name</label>
                      <div className="input-with-icon">
                        <Building size={16} className="input-icon-left" />
                        <input
                          type="text"
                          id="schoolOrCollege"
                          name="schoolOrCollege"
                          placeholder="e.g. St. Xavier's College"
                          value={formData.schoolOrCollege}
                          onChange={handleInputChange}
                          className={`form-input ${errors.schoolOrCollege ? 'error' : ''}`}
                        />
                      </div>
                      {errors.schoolOrCollege && <span className="error-message">{errors.schoolOrCollege}</span>}
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="action-btn secondary"
                        disabled={loading}
                      >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        className="action-btn primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <span>Complete Onboarding</span>
                            <Check size={16} strokeWidth={3} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <p className="bottom-card-hint">
              Your information is secure. We never share your data.
            </p>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
};

export default Onboarding;
