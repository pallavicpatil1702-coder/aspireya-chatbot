import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Brain,
  Target,
  Activity,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  Loader2,
  Check,
  Globe,
  ChevronDown
} from 'lucide-react';
import logo from '../assets/logo.png';
const API_URL = import.meta.env.VITE_API_URL || '';
const STUDENT_SECTIONS = [
  { name: 'Career Interests', range: [0, 14] },
  { name: 'Personality', range: [15, 29] },
  { name: 'Skills', range: [30, 44] },
  { name: 'Learning Style', range: [45, 59] },
  { name: 'Values & Motivation', range: [60, 74] },
  { name: 'Career Aptitude', range: [75, 89] }
];

const PROFESSIONAL_SECTIONS = [
  { name: 'Career Interests', range: [0, 14] },
  { name: 'Personality & Behaviour', range: [15, 29] },
  { name: 'Learning Style', range: [30, 44] },
  { name: 'Skills & Aptitude', range: [45, 59] },
  { name: 'Values & Motivation', range: [60, 74] },
  { name: 'Career Readiness', range: [75, 89] }
];

const LOADING_MESSAGES = [
  "Analyzing Personality...",
  "Calculating Career Match...",
  "Evaluating Strengths...",
  "Generating AI Insights...",
  "Preparing Career Intelligence Report..."
];

const LIKERT_OPTIONS = [
  { value: 'Strongly Agree', label: 'Strongly Agree' },
  { value: 'Agree', label: 'Agree' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Disagree', label: 'Disagree' },
  { value: 'Strongly Disagree', label: 'Strongly Disagree' }
];

const LanguageDropdown = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const itemsRef = useRef([]);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' }
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      dropdownRef.current?.querySelector('button')?.focus();
      return;
    }

    const currentIndex = itemsRef.current.findIndex(el => el === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < languages.length - 1 ? currentIndex + 1 : 0;
      itemsRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : languages.length - 1;
      itemsRef.current[prevIndex]?.focus();
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#ffffff',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #BFDBFE'}
        onBlur={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
      >
        <Globe size={16} color="#6B7280" />
        {currentLang.label}
        <ChevronDown size={16} color="#6B7280" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              minWidth: '140px',
              zIndex: 100
            }}
          >
            {languages.map((l, index) => (
              <button
                key={l.code}
                role="option"
                aria-selected={lang === l.code}
                ref={el => itemsRef.current[index] = el}
                onClick={() => {
                  setLang(l.code);
                  setIsOpen(false);
                  dropdownRef.current?.querySelector('button')?.focus();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: lang === l.code ? '#EFF6FF' : 'transparent',
                  color: lang === l.code ? '#1D4ED8' : '#374151',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: lang === l.code ? '600' : '400',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onBlur={(e) => {
                  if (lang !== l.code) e.currentTarget.style.backgroundColor = 'transparent';
                  else e.currentTarget.style.backgroundColor = '#EFF6FF';
                }}
                onMouseEnter={(e) => {
                  if (lang !== l.code) e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  if (lang !== l.code) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {l.label}
                {lang === l.code && <Check size={14} color="#1D4ED8" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Assessment = () => {
  const navigate = useNavigate();

  // Intro states
  const [initiate, setInitiate] = useState(false);
  const [isStarted, setIsStarted] = useState(() => {
    return localStorage.getItem('aspireya_assessment_running') === 'true';
  });

  // Assessment flow states
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [assessmentType, setAssessmentType] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('aspireya_assessment_current_index');
    return saved ? Number(saved) : 0;
  });

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('aspireya_assessment_answers');
    return saved ? JSON.parse(saved) : {};
  });

  const [transitioningSection, setTransitioningSection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [lang, setLang] = useState('en');

  const assessmentDetails = [
    {
      title: "CAREER DISCIPLINE ASSESSEMENT",
      desc: "Maps your alignment with fields like Technology ,Business, Design, Arts, Medical, and more.",
      icon: <Target size={20} style={{ color: 'var(--color-primary)' }} />,
      time: "5-7 mins"
    },
    {
      title: "APTITUDE ASSESSMENT",
      desc: "Evaluates your analytical, verbal, and creative cognitive problem-solving abilities.",
      icon: <Brain size={20} style={{ color: '#8B5CF6' }} />,
      time: "10-12 mins"
    },
    {
      title: "SKILL ASSESSEMENT",
      desc: "Understands your preferred environments: collaborative, self-driven, structured, or dynamic.",
      icon: <Activity size={20} style={{ color: '#10B981' }} />,
      time: "5 mins"
    },
    {
      title: "Career Fit Mapping",
      desc: "Analyzes matching roles and outputs a detailed personalized career recommendations report.",
      icon: <GraduationCap size={20} style={{ color: '#F59E0B' }} />,
      time: "Generated instantly"
    }
  ];

  // Fetch Questions

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const sessionId = localStorage.getItem('aspireya_session_id');

        const response = await fetch(
          `${API_URL}/api/assessment/questions`,
          {
            headers: {
              'Session-Id': sessionId || 'default-session'
            }
          }
        );
        if (!response.ok) {
          throw new Error('Failed to load questions from backend.');
        }
        const data = await response.json();
        if (data.assessmentType === 'undetermined') {
          setAssessmentType('undetermined');
          setQuestions([]);
          setSections([]);
          return;
        }

        if (data.questions && data.sections) {
          setQuestions(data.questions);
          setSections(data.sections);
          setAssessmentType(data.assessmentType);
        } else {
          setQuestions(data);
          const isStud = data.length > 0 && typeof data[0].question === 'object';
          setSections(isStud ? STUDENT_SECTIONS : PROFESSIONAL_SECTIONS);
          setAssessmentType(isStud ? 'student_8_10' : 'professional');
        }
      } catch (err) {
        console.error(err);
        setQuestionsError(err.message);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  // Section completion auto-timer hook
  useEffect(() => {
    if (transitioningSection) {
      const timer = setTimeout(() => {
        setTransitioningSection(null);
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        localStorage.setItem('aspireya_assessment_current_index', String(nextIdx));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [transitioningSection, currentIndex]);

  // Loading screen messages rotation
  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  // Keyboard navigation
  useEffect(() => {
    if (!isStarted || transitioningSection || isSubmitting || loadingQuestions || questions.length === 0) return;

    const handleKeyDown = (e) => {
      const currentQuestion = questions[currentIndex];
      if (!currentQuestion) return;

      // Number keys 1-5 for Likert / MCQ selection
      if (e.key >= '1' && e.key <= '5') {
        const optionIndex = Number(e.key) - 1;
        const options = currentQuestion.options || [];
        if (options[optionIndex]) {
          handleSelectOption(options[optionIndex]);
        }
      }

      // Left Arrow for Previous
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious();
      }

      // Right Arrow or Enter for Next
      if ((e.key === 'ArrowRight' || e.key === 'Enter') && answers[currentQuestion.id] !== undefined) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, currentIndex, questions, answers, transitioningSection, isSubmitting, loadingQuestions]);

  const handleStart = () => {
    setInitiate(true);
    setTimeout(() => {
      localStorage.setItem('aspireya_assessment_running', 'true');
      setIsStarted(true);
      setInitiate(false);
    }, 1500);
  };

  const handleSelectOption = (value) => {
    const currentQuestion = questions[currentIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    localStorage.setItem('aspireya_assessment_answers', JSON.stringify(newAnswers));
  };

  const handleChooseType = async (type) => {
    setLoadingQuestions(true);
    try {
      const sessionId = localStorage.getItem('aspireya_session_id');
      const response = await fetch(`${API_URL}/api/assessment/questions?type=${type}`, {
        headers: {
          'Session-Id': sessionId || 'default-session'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load assessment questions.');
      }
      const data = await response.json();
      setQuestions(data.questions);
      setSections(data.sections);
      setAssessmentType(data.assessmentType);
      setQuestionsError(null);
    } catch (err) {
      console.error(err);
      setQuestionsError(err.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const getSectionInfo = (index) => {
    if (!sections || sections.length === 0) return { sectionIndex: 0, sectionName: '' };
    const secIdx = sections.findIndex(sec => index >= sec.range[0] && index <= sec.range[1]);
    return {
      sectionIndex: secIdx !== -1 ? secIdx : 0,
      sectionName: secIdx !== -1 ? sections[secIdx].name : ''
    };
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    if (answers[currentQuestion.id] === undefined) return;

    // Check if next is section completion transition screen
    if (!sections || sections.length === 0) return;
    const isSectionEnd = sections.some(sec => currentIndex === sec.range[1] && currentIndex < questions.length - 1);

    if (isSectionEnd) {
      const currentSec = getSectionInfo(currentIndex).sectionName;
      const nextSec = getSectionInfo(currentIndex + 1).sectionName;
      setTransitioningSection({ completed: currentSec, next: nextSec });
    } else if (currentIndex === questions.length - 1) {
      handleSubmit();
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      localStorage.setItem('aspireya_assessment_current_index', String(nextIdx));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      localStorage.setItem('aspireya_assessment_current_index', String(prevIdx));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: Number(qId),
        answer: val
      }));

      let sessionId = localStorage.getItem('aspireya_session_id');

      const response = await fetch('/api/report/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session-Id': sessionId || 'default-session'
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          assessmentType: assessmentType
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit assessment');
      }

      // Success: Clear localStorage variables
      localStorage.removeItem('aspireya_assessment_answers');
      localStorage.removeItem('aspireya_assessment_current_index');
      localStorage.removeItem('aspireya_assessment_running');

      // Small delay for clean transition feel
      setTimeout(() => {
        navigate('/report');
      }, 1000);

    } catch (err) {
      console.error(err);
      alert(err.message || 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isStarted) {
    // Render the Introduction Page (With 100% style preservation)
    return (
      <div className="assessment-page-container">
        <style>{`
          .assessment-page-container {
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-main);
            font-family: 'Inter', system-ui, sans-serif;
            padding: 24px;
          }
          
          .assessment-card {
            background: #ffffff;
            border: 1px solid var(--border-light);
            border-radius: 24px;
            width: 100%;
            max-width: 760px;
            padding: 32px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          }
          
          @media (min-width: 640px) {
            .assessment-card {
              padding: 48px;
            }
          }
          
          .back-nav {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            background: transparent;
            margin-bottom: 28px;
            transition: color 0.2s ease;
          }
          
          .back-nav:hover {
            color: var(--color-primary);
          }
          
          .assessment-header {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 36px;
          }
          
          .badge-premium {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(37, 99, 235, 0.08);
            color: var(--color-primary);
            padding: 6px 14px;
            border-radius: 99px;
            font-size: 0.78rem;
            font-weight: 700;
            width: fit-content;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .assessment-title {
            font-family: var(--font-heading);
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
          }
          
          .assessment-subtitle {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
            max-width: 640px;
            margin: 0;
          }
          
          .details-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 40px;
          }
          
          @media (min-width: 640px) {
            .details-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
          
          .detail-item-card {
            background: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            gap: 16px;
            transition: all 0.2s ease;
          }
          
          .detail-item-card:hover {
            border-color: rgba(37, 99, 235, 0.15);
            background: #ffffff;
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.03);
            transform: translateY(-2px);
          }
          
          .icon-container {
            background: #ffffff;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
            border: 1px solid #f1f5f9;
            flex-shrink: 0;
          }
          
          .detail-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .detail-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }
          
          .detail-title {
            font-size: 0.92rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
          }
          
          .detail-time {
            font-size: 0.72rem;
            color: var(--text-muted);
            font-weight: 600;
          }
          
          .detail-desc {
            font-size: 0.82rem;
            color: var(--text-secondary);
            line-height: 1.5;
            margin: 0;
          }
          
          .advisory-banner {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 1px solid #bfdbfe;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            gap: 16px;
            margin-bottom: 40px;
          }
          
          .advisory-text {
            font-size: 0.85rem;
            color: #1e3a8a;
            line-height: 1.5;
            margin: 0;
            font-weight: 500;
          }
          
          .actions-row {
            display: flex;
            flex-direction: column-reverse;
            gap: 12px;
            justify-content: space-between;
          }
          
          @media (min-width: 640px) {
            .actions-row {
              flex-direction: row;
              align-items: center;
            }
          }
          
          .btn-action {
            height: 48px;
            padding: 10px 28px;
            border-radius: 14px;
            font-weight: 600;
            font-size: 0.92rem;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
            border: none;
          }
          
          .btn-action.primary {
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);
          }
          
          .btn-action.primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
            filter: brightness(1.05);
          }
          
          .btn-action.secondary {
            background: #ffffff;
            color: var(--text-secondary);
            border: 1px solid var(--border-light);
          }
          
          .btn-action.secondary:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }
          
          .btn-action:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          .spinner {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div className="assessment-card">
          <button className="back-nav" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            <span>Back to Chat</span>
          </button>

          <div className="assessment-header">
            <div className="badge-premium">
              <img src={logo} alt="Aspireya Logo" style={{ height: '16px', width: 'auto', objectFit: 'contain' }} />
              <span>Diagnostic</span>
            </div>
            <h1 className="assessment-title">Career Assessment Test</h1>
            <p className="assessment-subtitle">
              Welcome to the Aspireya Consulting Career Assessment. This scientifically designed assessment evaluates your interests, capabilities, and work preferences to suggest optimal career paths.
            </p>
          </div>

          <div className="details-grid">
            {assessmentDetails.map((item, idx) => (
              <div key={idx} className="detail-item-card">
                <div className="icon-container">
                  {item.icon}
                </div>
                <div className="detail-info">
                  <div className="detail-title-row">
                    <h3 className="detail-title">{item.title}</h3>
                    <span className="detail-time">{item.time}</span>
                  </div>
                  <p className="detail-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {assessmentType === 'undetermined' ? (
            <div className="category-selection-container">
              <style>{`
                .category-selection-container {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  margin-bottom: 30px;
                  background: #f8fafc;
                  border: 1px dashed #cbd5e1;
                  padding: 24px;
                  border-radius: 16px;
                }
                .category-btn {
                  padding: 16px;
                  border-radius: 12px;
                  border: 1px solid #e2e8f0;
                  background: #ffffff;
                  text-align: left;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                }
                .category-btn:hover {
                  border-color: var(--color-primary);
                  background: rgba(23, 39, 91, 0.05);
                }
                .category-title {
                  font-weight: 700;
                  color: #1e293b;
                  font-size: 0.95rem;
                }
                .category-subtitle {
                  font-size: 0.8rem;
                  color: #64748b;
                }
              `}</style>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                Please select your profile to customize the assessment questions:
              </p>
              <button className="category-btn" onClick={() => handleChooseType('student_8_10')}>
                <span className="category-title">School Student (Class 8–10)</span>
                <span className="category-subtitle">Focuses on stream selection and foundational subjects.</span>
              </button>
              <button className="category-btn" onClick={() => handleChooseType('student_11_12')}>
                <span className="category-title">Senior High School Student (Class 11–12)</span>
                <span className="category-subtitle">Focuses on undergraduate degrees, courses, and college tracks.</span>
              </button>
              <button className="category-btn" onClick={() => handleChooseType('undergraduate')}>
                <span className="category-title">College Undergraduate Student</span>
                <span className="category-subtitle">Focuses on degree-to-career transitions, key skill gaps, and internships.</span>
              </button>
              <button className="category-btn" onClick={() => handleChooseType('professional')}>
                <span className="category-title">Working Professional / Post-Graduate</span>
                <span className="category-subtitle">Focuses on corporate roles, leadership styles, remote work, and lateral transitions.</span>
              </button>
            </div>
          ) : (
            <>
              <div className="advisory-banner">
                <CheckCircle2 size={24} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <p className="advisory-text">
                  <strong>Ready to start?</strong> Your profile details have been saved. You can take this assessment right now, or request an expert callback to help walk you through the diagnostic process.
                </p>
              </div>

              <div className="actions-row">
                <button className="btn-action secondary" onClick={() => navigate('/')}>
                  <MessageSquare size={16} />
                  <span>Talk to AI Mentor</span>
                </button>

                <button
                  className="btn-action primary"
                  onClick={handleStart}
                  disabled={initiate}
                >
                  {initiate ? (
                    <>
                      <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" opacity="0.25" />
                        <path fill="currentColor" d="M12 2a10 10 0 0 0-10 10h4a6 6 0 0 1 6-6V2z" />
                      </svg>
                      <span>Initializing...</span>
                    </>
                  ) : (
                    <>
                      <Compass size={18} />
                      <span>Start Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Load States for assessment questions
  if (loadingQuestions) {
    return (
      <div className="assessment-page-container">
        <style>{`
          .loading-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            color: var(--text-secondary);
          }
        `}</style>
        <div className="loading-wrapper">
          <Loader2 size={36} className="spinner" style={{ color: 'var(--color-primary)' }} />
          <p>Preparing multi-dimensional assessment...</p>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="assessment-page-container">
        <div className="assessment-card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#EF4444', marginBottom: '16px' }}>Initialization Failed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{questionsError}</p>
          <button className="btn-action primary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Submitted Loading Screen
  if (isSubmitting) {
    return (
      <motion.div
        className="loading-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <style>{`
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            box-sizing: border-box;
          }
          .premium-loader-card {
            background: #ffffff;
            border: 1px solid var(--border-light);
            border-radius: 24px;
            padding: 48px;
            max-width: 600px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .spinner-outer {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 4px dashed var(--color-primary);
            animation: spin 6s linear infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
          }
          .spinner-inner {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 4px solid var(--color-secondary);
            border-top-color: transparent;
            animation: spin 1s linear infinite reverse;
          }
          .rotating-message {
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--text-primary);
            min-height: 28px;
          }
        `}</style>
        <motion.div
          className="premium-loader-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        >
          <div className="spinner-outer">
            <div className="spinner-inner"></div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rotating-message"
            >
              {LOADING_MESSAGES[loadingMessageIndex]}
            </motion.div>
          </AnimatePresence>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '16px', lineHeight: 1.5 }}>
            Our AI analysis engine is reviewing your interests, skills, personality, values, and aptitude scores to formulate a customized Career Intelligence Report.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // Section completed intermediate screen (2 seconds duration)
  if (transitioningSection) {
    return (
      <motion.div
        className="section-completed-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <style>{`
          .section-completed-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            box-sizing: border-box;
          }
          .section-completed-card {
            background: #ffffff;
            border: 1px solid var(--border-light);
            border-radius: 24px;
            padding: 48px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .check-icon-ring {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.1);
            color: #10B981;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
          }
        `}</style>
        <motion.div
          className="section-completed-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.15 }}
            className="check-icon-ring"
          >
            <Check size={36} strokeWidth={3} />
          </motion.div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {transitioningSection.completed} Completed
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.96rem', marginBottom: '24px' }}>
            Great Job!
          </p>
          <div style={{ height: '1px', background: '#F1F5F9', width: '100%', marginBottom: '20px' }}></div>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>Next Section</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {transitioningSection.next}
          </span>
        </motion.div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const { sectionIndex, sectionName } = getSectionInfo(currentIndex);
  const currentAnswer = answers[currentQuestion.id];
  const totalQuestions = questions.length;
  const overallProgress = (currentIndex / totalQuestions) * 100;
  const activeSections = sections;

  // Likert options or MCQ options
  const isLikert = currentQuestion.type === 'likert';
  const options = isLikert
    ? (typeof currentQuestion.options?.[0] === 'object'
      ? currentQuestion.options.map(o => ({ value: o.en || o.value || '', label: o[lang] || o.en || '' }))
      : LIKERT_OPTIONS
    )
    : (currentQuestion.options || []).map(o => {
      if (typeof o === 'object') {
        return { value: o.en || o.value || '', label: o[lang] || o.en || '' };
      }
      return { value: o, label: o };
    });

  return (
    <div className="assessment-page-container">
      <style>{`
        .assessment-page-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-main);
          font-family: 'Inter', system-ui, sans-serif;
          padding: 24px;
        }

        .assessment-engine-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: 24px;
          width: 100%;
          max-width: 720px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .assessment-engine-card {
            padding: 40px;
          }
        }
        
        @media (max-width: 640px) {
          .assessment-page-container {
            padding: 12px;
          }
          .assessment-engine-card {
            padding: 24px 16px;
            border-radius: 16px;
          }
          .engine-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 24px;
          }
          .question-text-p {
            font-size: 1.1rem;
            margin-bottom: 20px;
          }
          .option-item-btn {
            padding: 12px 16px;
            font-size: 0.85rem;
          }
          .navigation-block {
            padding-top: 16px;
          }
          .btn-nav {
            padding: 0 12px;
            font-size: 0.82rem;
          }
        }

        .engine-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .engine-eyebrow {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .engine-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 2px 0 0 0;
        }

        .section-badge {
          background: rgba(37, 99, 235, 0.08);
          color: var(--color-primary);
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .language-selector {
          display: inline-flex;
          gap: 2px;
          background: #f1f5f9;
          padding: 2px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }

        .language-selector button {
          border: none;
          background: transparent;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .language-selector button.active {
          background: #ffffff;
          color: var(--color-primary);
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        /* Progress Bar */
        .progress-block {
          margin-bottom: 32px;
        }

        .progress-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .progress-track {
          height: 8px;
          background: #f1f5f9;
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          border-radius: 99px;
          transition: width 0.3s ease;
        }

        /* Question Frame */
        .question-frame {
          min-height: 240px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
        }

        .question-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .question-text-p {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.5;
          margin: 0 0 24px 0;
        }

        /* Options Stack */
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-item-btn {
          border: 1px solid var(--border-light);
          border-radius: 14px;
          padding: 16px 20px;
          text-align: left;
          background: #ffffff;
          cursor: pointer;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .option-item-btn:hover {
          border-color: rgba(37, 99, 235, 0.25);
          background: #f8fafc;
          color: var(--text-primary);
          transform: translateX(2px);
        }

        .option-item-btn.selected {
          border-color: var(--color-primary);
          background: rgba(37, 99, 235, 0.04);
          color: var(--color-primary);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.04);
        }

        .keyboard-hint {
          font-size: 0.65rem;
          font-weight: 700;
          background: #f1f5f9;
          color: var(--text-muted);
          padding: 3px 6px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .option-item-btn.selected .keyboard-hint {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }

        /* Navigation Row */
        .navigation-block {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 24px;
        }

        .btn-nav {
          height: 44px;
          padding: 0 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-nav.prev {
          background: #ffffff;
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
        }

        .btn-nav.prev:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-nav.next {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        .btn-nav.next:hover:not(:disabled) {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        .btn-nav:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>

      <div className="assessment-engine-card">
        {/* Header Row */}
        <div className="engine-header-row">
          <div>
            <span className="engine-eyebrow">Career Assessment</span>
            <h1 className="engine-title">{sectionName}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {questions.length > 0 && typeof questions[0].question === 'object' && (
              <LanguageDropdown lang={lang} setLang={setLang} />
            )}
            <div className="section-badge">
              Section {sectionIndex + 1} of 6
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="progress-block">
          <div className="progress-label-row">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(overallProgress)}% Completed</span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              animate={{
                width: `${overallProgress}%`
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            />
          </div>
        </div>

        {/* Animated Question Frame */}
        <div className="question-frame">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.96
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: -40,
                scale: 0.96
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut"
              }}
              style={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              <div className="question-meta-row">
                <span>Section Item {currentIndex - activeSections[sectionIndex].range[0] + 1} / 15</span>
                <span>{isLikert ? 'Likert Scale' : 'Cognitive MCQ'}</span>
              </div>

              <p className="question-text-p">
                {typeof currentQuestion.question === 'object'
                  ? (currentQuestion.question[lang] || currentQuestion.question.en)
                  : currentQuestion.question}
              </p>

              <div className="options-list">
                {options.map((opt, idx) => {
                  const isSelected = currentAnswer === opt.value;
                  return (
                    <button
                      key={idx}
                      className={`option-item-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(opt.value)}
                    >
                      <span>{opt.label}</span>
                      <span className="keyboard-hint">{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Action Block */}
        <div className="navigation-block">
          <button
            className="btn-nav prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            className="btn-nav next"
            onClick={handleNext}
            disabled={currentAnswer === undefined}
          >
            <span>{currentIndex === 89 ? 'Submit Assessment' : 'Next'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
