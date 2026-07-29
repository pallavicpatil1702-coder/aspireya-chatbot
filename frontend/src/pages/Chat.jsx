import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Calendar, ArrowRight, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Chat = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleOpenChat = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-aspireya-chat'));
  };

  return (
    <div className="main-content">
      {/* Sticky Navbar */}
      <nav className="navbar">
        <div className="nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ padding: '6px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', boxSizing: 'border-box' }}>
            <img src={logo} alt="Aspireya Logo" className="nav-logo" />
          </div>
        </div>
        
        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'none', color: 'var(--text-primary)' }}
        >
          <Menu size={28} />
        </button>

        {isMobileMenuOpen && (
          <div className="mobile-drawer-backdrop" onClick={toggleMobileMenu}></div>
        )}

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="mobile-drawer-header">
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Menu</span>
            <button onClick={toggleMobileMenu} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <X size={24} />
            </button>
          </div>
          <a href="#" className="nav-link active">Home</a>
          <button
            onClick={() => navigate('/onboarding')}
            className="nav-link"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            Career Assessment
          </button>
          <button
            onClick={handleOpenChat}
            className="nav-link"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            Chat with Mentor
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-tag">
          <Sparkles size={14} style={{ color: '#4f46e5' }} />
          <span>Next-Gen Career Mentorship</span>
        </div>
        <h1 className="hero-title" style={{ color: 'var(--text-primary)' }}>
          Shape Your Future with <span className="gradient-text">Aspireya AI</span>
        </h1>
        <p className="hero-desc">
          Empowering students and professionals to unlock their true potential through smart AI career guidance, multi-dimensional assessments, and customized mentorship roadmaps.
        </p>
        <div className="hero-actions">
          <button onClick={() => navigate('/onboarding')} className="btn btn-primary">
            <span>Take Career Assessment</span>
            <ArrowRight size={18} />
          </button>
          <button onClick={handleOpenChat} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>Chat with AI Mentor</span>
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid">
        <div className="glass-card feature-card">
          <div className="feature-icon">
            <Sparkles size={22} />
          </div>
          <h3>AI Career Mentor</h3>
          <p>
            Get 24/7 real-time answers to your questions about careers, stream selection, courses, skills, and preparation plans from our intelligent mentor.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <Compass size={22} />
          </div>
          <h3>Smart Assessments</h3>
          <p>
            Take our specialized multi-dimensional assessments mapping your discipline alignments, cognitive aptitudes, and personality fit values.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
            <Calendar size={22} />
          </div>
          <h3>Expert Counseling</h3>
          <p>
            Connect with seasoned counseling experts from Aspireya Consulting for personalized 1-on-1 career guidance sessions.
          </p>
        </div>
      </section>

      <footer style={{ marginTop: 'auto', textAlign: 'center', padding: '24px', fontSize: '0.82rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', width: '100%' }}>
        © 2026 Aspireya Consulting. All rights reserved.
      </footer>
    </div>
  );
};

export default Chat;
