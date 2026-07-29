import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Printer, Download } from 'lucide-react';
import logo from '../../assets/logo.png';
import ReportRouter from './ReportRouter.jsx';
import ReportErrorState from './shared/ReportErrorState.jsx';
import ReportUnavailable from './shared/ReportUnavailable.jsx';
import { validateAndNormalizeReport } from './utils/reportValidation.js';
import './reports.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * ReportPage is the top-level container that loads, validates, and frames the report.
 */
const ReportPage = ({ isPremiumRoute = false }) => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewPremium, setViewPremium] = useState(isPremiumRoute);
  const [shareCopied, setShareCopied] = useState(false);
  const [pdfState, setPdfState] = useState('idle'); // 'idle' | 'generating'
  const [toastMsg, setToastMsg] = useState(null); // { text, type: 'success' | 'error' }

  const showToast = (text, type) => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      let sessionId = localStorage.getItem('aspireya_session_id');
      const response = await fetch('/api/report', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Session-Id': sessionId || 'default-session'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('NOT_FOUND');
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to retrieve report');
      }

      const data = await response.json();
      
      // Perform validation and normalization
      const validation = validateAndNormalizeReport(data);
      if (!validation.isValid) {
        console.warn("[Validation Warning] Report data validation failed:", validation.errors);
      }
      
      setReport(validation.normalized);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    if (report) {
      const entitled = report.isPremium || localStorage.getItem('aspireya_premium_unlocked') === 'true';
      if (isPremiumRoute && !entitled) {
        // Prevent access and redirect to free report
        navigate('/report', { replace: true });
      } else {
        // Set view mode to match route
        setViewPremium(isPremiumRoute);
      }
    }
  }, [report, isPremiumRoute, navigate]);

  const handleUpgradeClick = () => {
    const entitled = report && (report.isPremium || localStorage.getItem('aspireya_premium_unlocked') === 'true');
    if (entitled) {
      navigate('/report/premium');
    } else {
      navigate('/premium');
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    setPdfState('generating');
    
    // 2. Temporarily add body-level class
    document.body.classList.add('pdf-export-mode');

    try {
      const element = document.getElementById('assessment-report-content');
      if (!element) {
        throw new Error("Report content element not found");
      }

      // Query sections sequentially
      let elementsToRender = [];
      const innerContainer = element.querySelector('.report-inner-container');
      
      if (innerContainer) {
        const children = Array.from(innerContainer.children);
        if (children[0]) elementsToRender.push({ element: children[0], type: 'page' }); // Cover
        if (children[1]) elementsToRender.push({ element: children[1], type: 'page' }); // Dashboard
        
        if (children[2]) {
          const sections = Array.from(children[2].children);
          sections.forEach(sec => {
            elementsToRender.push({ element: sec, type: 'section' });
          });
        }
      } else {
        // Fallback
        const explicitPages = element.querySelectorAll('.pdf-page');
        explicitPages.forEach(el => elementsToRender.push({ element: el, type: 'page' }));
        
        const explicitSections = element.querySelectorAll('.pdf-section, .pdf-keep-together');
        explicitSections.forEach(el => elementsToRender.push({ element: el, type: 'section' }));
      }

      if (elementsToRender.length === 0) {
        throw new Error("No report sections resolved for PDF generation");
      }

      // Initialize jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 12; // compact margin to prevent overflow
      const contentWidth = 210 - (margin * 2); // 186mm
      const pageHeight = 297;
      let currentY = margin;
      let isFirstPage = true;

      for (let i = 0; i < elementsToRender.length; i++) {
        const item = elementsToRender[i];
        
        // Hide scrollbars/overflow on element for html2canvas
        const originalStyle = item.element.style.cssText;
        item.element.style.overflow = 'visible';
        item.element.style.height = 'auto';

        const canvas = await html2canvas(item.element, {
          scale: 2, // high quality
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        // Restore original style
        item.element.style.cssText = originalStyle;

        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (item.type === 'page') {
          // Full page items (Cover, Dashboard)
          if (!isFirstPage) {
            pdf.addPage();
          }
          isFirstPage = false;
          // Scale to fit page height if needed, otherwise center it
          const scaleFactor = Math.min(1, (pageHeight - (margin * 2)) / imgHeight);
          const finalHeight = imgHeight * scaleFactor;
          const finalWidth = imgWidth * scaleFactor;
          const xOffset = margin + (imgWidth - finalWidth) / 2;
          
          pdf.addImage(imgData, 'JPEG', xOffset, margin, finalWidth, finalHeight);
          currentY = pageHeight; // force next element to add a new page
        } else {
          // Section items
          if (imgHeight > pageHeight - (margin * 2)) {
            // Scale down to fit page
            const scaleFactor = (pageHeight - (margin * 2)) / imgHeight;
            const finalHeight = imgHeight * scaleFactor;
            const finalWidth = imgWidth * scaleFactor;
            const xOffset = margin + (imgWidth - finalWidth) / 2;
            
            if (!isFirstPage) {
              pdf.addPage();
            }
            isFirstPage = false;
            pdf.addImage(imgData, 'JPEG', xOffset, margin, finalWidth, finalHeight);
            currentY = pageHeight;
          } else {
            // Check if it fits on current page
            if (currentY === pageHeight || (currentY + imgHeight > pageHeight - margin)) {
              if (!isFirstPage) {
                pdf.addPage();
              }
              isFirstPage = false;
              currentY = margin;
            }

            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 6; // gap between sections
          }
        }
      }

      // Filename mapping
      const capFirst = (str) => {
        if (!str) return '';
        if (str === 'student_8_10') return 'Student_8_10';
        if (str === 'student_11_12') return 'Student_11_12';
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      const cleanType = capFirst(report.assessmentType);
      const cleanName = report.userName.trim().replace(/\s+/g, '_');
      pdf.save(`Aspireya_Career_Report_${cleanName}_${cleanType}.pdf`);

      showToast("Your PDF has been downloaded successfully.", "success");
      setPdfState('idle');
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("Unable to generate the PDF. Please try again.", "error");
      setPdfState('idle');
    } finally {
      // 4. Restore original page state in finally block
      document.body.classList.remove('pdf-export-mode');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Aspireya Career Report',
      text: 'Check out my Aspireya Career Intelligence Report!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.warn("navigator.share failed, trying Clipboard API:", err);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("Clipboard API failed, trying copy fallback:", err);
      }
    }

    // Fallback copy
    try {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("All sharing methods failed:", err);
      alert("Could not copy link automatically. Please copy the URL from the browser address bar.");
    }
  };

  if (loading) {
    return (
      <div className="report-loading-container">
        <style>{`
          .report-loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-main);
            font-family: 'Inter', sans-serif;
            gap: 16px;
          }
          .spinner-ring {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(37, 99, 235, 0.1);
            border-top-color: var(--color-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="spinner-ring"></div>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Compiling Psychometric Career Report...</p>
      </div>
    );
  }

  if (error === 'NOT_FOUND') {
    return (
      <ReportUnavailable 
        message="It looks like you haven't taken the Aspireya Career Assessment yet. Take the diagnostic test now to receive your multi-dimensional insights portfolio."
      />
    );
  }

  if (error) {
    return (
      <ReportErrorState 
        error={error} 
        onRetry={fetchReport} 
      />
    );
  }

  if (!report) {
    return (
      <ReportUnavailable 
        message="The report document could not be loaded." 
      />
    );
  }

  return (
    <div className="report-page-container">
      <style>{`
        @keyframes aspireyaMeshGlow {
          0% { background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%; }
          50% { background-position: 15px -20px, -20px 25px, 20px 15px, -15px -20px; }
          100% { background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%; }
        }

        .report-page-container {
          min-height: 100vh;
          width: 100%;
          background-color: #f1f4f9;
          background-image: 
            radial-gradient(at 10% 15%, rgba(150, 178, 220, 0.65) 0px, transparent 55%),
            radial-gradient(at 35% 75%, rgba(255, 214, 186, 0.65) 0px, transparent 55%),
            radial-gradient(at 90% 15%, rgba(186, 203, 236, 0.55) 0px, transparent 55%),
            radial-gradient(at 85% 85%, rgba(215, 224, 245, 0.6) 0px, transparent 55%);
          background-attachment: fixed;
          animation: aspireyaMeshGlow 18s ease-in-out infinite;
          font-family: 'Inter', system-ui, sans-serif;
          padding: 24px;
          box-sizing: border-box;
        }

        .report-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.04);
        }

        .branded-seal {
          padding: 12px 24px;
          background: linear-gradient(90deg, #faf5ff 0%, #eff6ff 50%, #f0fdf4 100%);
          border-bottom: 1px solid #e2e8f0;
          text-align: center;
          font-size: 0.72rem;
          color: #4f46e5;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .report-inner {
          padding: 32px;
        }

        .report-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          padding: 10px 20px;
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-back:hover {
          color: var(--color-primary);
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .premium-report-toolbar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 16px 20px;
          border-radius: 16px;
        }

        .toolbar-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 16px;
          flex-wrap: wrap;
        }

        .toolbar-left, .toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-back-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        .btn-back-primary:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
        }

        .btn-back-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .toolbar-metadata {
          display: flex;
          gap: 12px;
          font-size: 0.78rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-light);
          padding-top: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .metadata-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .metadata-divider {
          color: var(--border-light);
        }

        .summary-card {
          background: #f8fafc;
          border: 1px solid var(--border-light);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 32px;
        }

        .report-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }

        .badge-brand {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(37, 99, 235, 0.08);
          color: var(--color-primary);
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .report-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 8px;
          margin-bottom: 4px;
        }

        .report-meta-text {
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .summary-text-p {
          font-size: 0.94rem;
          color: var(--text-secondary);
          line-height: 1.6;
          border-left: 3px solid var(--color-primary);
          padding-left: 16px;
          margin: 0;
        }

        .footer-seal {
          padding: 16px;
          border-top: 1px solid var(--border-light);
          text-align: center;
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          background: #f8fafc;
        }

        @media print {
          .premium-report-toolbar, .no-print {
            display: none !important;
          }
        }
        
        /* Mobile Premium Toolbar Fixes - Kept in one row like Desktop */
        @media (max-width: 600px) {
          .report-page-container {
            padding: 8px !important;
            overflow-x: hidden;
            width: 100%;
            box-sizing: border-box;
          }
          .report-inner {
            padding: 12px !important;
            overflow-x: hidden;
            width: 100%;
            box-sizing: border-box;
          }
          .report-wrapper {
            max-width: 100%;
            box-sizing: border-box;
          }
          .premium-toolbar-row {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            overflow-x: auto;
            gap: 8px !important;
          }
          .premium-toolbar-group {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 6px !important;
          }
          .premium-toolbar-group button {
            padding: 6px 10px !important;
            font-size: 0.72rem !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }
        }
      `}</style>

      {/* Top stamped seal */}
      <div className="branded-seal">
        Certified Psychometric Document | Verified under the Aspireya Career Intelligence Framework
      </div>

      <div className="report-wrapper">
        {/* Executive Navigation Toolbar (Outside printable content) */}
        <div className="report-inner" style={{ paddingBottom: 0 }}>
          {viewPremium ? (
            <div 
              className="no-print"
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '16px 22px',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Action Buttons Row */}
              <div 
                className="premium-toolbar-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                  width: '100%'
                }}
              >
                {/* Left Navigation */}
                <div className="premium-toolbar-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => navigate('/')}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Dashboard</span>
                  </button>

                  <button 
                    onClick={() => navigate('/report')}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#4f46e5',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ← Back to Free Report
                  </button>
                </div>

                {/* Right Actions */}
                <div className="premium-toolbar-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={handleShare}
                    style={{
                      background: '#eef2ff',
                      border: '1px solid #c7d2fe',
                      color: '#3730a3',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Share2 size={16} />
                    <span>{shareCopied ? 'Link Copied!' : 'Share Report'}</span>
                  </button>

                  <button 
                    onClick={() => window.print()}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Printer size={16} />
                    <span>Print Report</span>
                  </button>

                  <button 
                    onClick={handleDownloadPDF}
                    disabled={pdfState === 'generating'}
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 22px',
                      borderRadius: '12px',
                      fontSize: '0.84rem',
                      fontWeight: 900,
                      cursor: pdfState === 'generating' ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
                    }}
                  >
                    <Download size={16} />
                    <span>{pdfState === 'generating' ? 'Preparing PDF...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Metadata Ribbon Row */}
              <div 
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                  fontSize: '0.76rem',
                  color: '#475569',
                  fontFamily: 'var(--report-font-metrics, monospace)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span><strong>Assessment Date:</strong> {new Date(report.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span><strong>Report ID:</strong> {report.uid ? `${report.uid.slice(0, 16)}...` : 'N/A'}</span>
                </div>

                <div 
                  style={{
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    color: '#047857',
                    padding: '3px 10px',
                    borderRadius: '99px',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  <span>Version: v2.4-Premium Certified</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="report-nav">
              <button className="btn-back" onClick={() => navigate('/')}>
                <ArrowLeft size={16} />
                <span>Back to Chat</span>
              </button>
              <img 
                src={logo} 
                alt="Aspireya Logo" 
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
              />
            </div>
          )}
        </div>

        {/* Printable/Exportable Content */}
        <div id="assessment-report-content">
          <div className="branded-seal" style={{ borderBottom: 'none' }}>
            Certified Psychometric Document | Verified under the Aspireya Career Intelligence Framework
          </div>
          <div className="report-inner" style={{ paddingTop: 0 }}>
            <ReportRouter 
              report={report} 
              isPremiumUnlocked={viewPremium}
              hasPremium={report.isPremium || localStorage.getItem('aspireya_premium_unlocked') === 'true'}
              handleUpgrade={handleUpgradeClick} 
            />
          </div>
          <div className="footer-seal" style={{ borderTop: 'none' }}>
            Certified Psychometric Document | Verified under the Aspireya Career Intelligence Framework
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {toastMsg && (
        <div className={`report-toast ${toastMsg.type} no-print`}>
          <style>{`
            .report-toast {
              position: fixed;
              bottom: 24px;
              left: 50%;
              transform: translateX(-50%);
              background: #0f172a;
              color: #ffffff;
              padding: 12px 24px;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
              z-index: 10000;
              font-size: 0.88rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              animation: slideUp 0.3s ease-out;
            }
            .report-toast.success {
              border-left: 4px solid #10b981;
            }
            .report-toast.error {
              border-left: 4px solid #ef4444;
            }
            @keyframes slideUp {
              from { transform: translate(-50%, 20px); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
          `}</style>
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
