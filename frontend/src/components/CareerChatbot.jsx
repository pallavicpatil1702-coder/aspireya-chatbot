import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Trash2,
  Calendar,
  Compass,
  Sparkles,
  Clock,
  BookOpen,
  X,
  CheckCircle,
  MessageSquare,
  Minus,
  Sun,
  Moon
} from 'lucide-react';
import { fetchChatHistory, sendChatMessage, clearChatHistory } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import chatbotAvatar from '../assets/chatbot-avatar.png';
import logo from '../assets/logo.png';

const CareerChatbot = ({
  isFloating = false,
  onAssessmentClick,
  onSessionClick,
  fetchHistory = fetchChatHistory,
  sendMessage = sendChatMessage,
  clearHistory = clearChatHistory,
  userProfile = null
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('aspireya_chatbot_theme') || 'light');

  const toggleTheme = (e) => {
    e.stopPropagation();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('aspireya_chatbot_theme', newTheme);
  };

  // Custom event listener to open chat from outside
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setShowTooltip(false);
    };
    window.addEventListener('open-aspireya-chat', handleOpenChat);
    return () => window.removeEventListener('open-aspireya-chat', handleOpenChat);
  }, []);

  // Tooltip delay timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const messagesEndRef = useRef(null);

  // Quick Action buttons below welcome message (Section 11)
  const quickActions = [
    { label: 'Explore Careers', icon: <Compass size={14} />, query: 'Tell me about promising career options for the future.' },
    { label: 'Stream Selection', icon: <BookOpen size={14} />, query: 'Which stream should I choose after 10th?' },
    { label: 'After 12th Courses', icon: <BookOpen size={14} />, query: 'Which course is better after 12th?' },
    { label: 'Resume Help', icon: <Clock size={14} />, query: 'Give me top tips for creating a strong entry-level resume.' }
  ];

  // Suggested Quick Replies at the bottom (Section 12)
  const quickReplies = [
    'After 10th',
    'After 12th',
    'Engineering',
    'Medical',
    'Commerce',
    'Arts',
    'AI & Data Science',
    'Cyber Security',
    'Resume Help'
  ];

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const historyData = await fetchHistory();
        setMessages(historyData.messages || []);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setLoading(false);
      }
    };

    // If inline, load immediately. If floating, load when opened.
    if (!isFloating || isOpen) {
      loadHistory();
    }
  }, [isOpen, isFloating, fetchHistory]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, submitting, isOpen]);

  // Handle unread counts for floating bubble mode
  useEffect(() => {
    if (isFloating && !isOpen && messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'ai') {
        setUnreadCount(prev => prev + 1);
      }
    }
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen, isFloating]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || submitting) return;

    setInputText('');
    setSubmitting(true);

    // Optimistically update local UI
    const tempUserMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await sendMessage(query);
      if (response && response.messages) {
        setMessages(response.messages);
      } else {
        // Fallback for response
        const fallbackText = response.reply || "Thanks for your response. Let's continue exploring career paths!";
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ I encountered an error. Please verify that the backend server is running and your Gemini API Key is configured.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearHistory = async (e) => {
    e.stopPropagation(); // Avoid triggering open/close when clicking in floating mode header
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      try {
        const result = await clearHistory();
        if (result && result.messages) {
          setMessages(result.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to clear chat history:', error);
      }
    }
  };

  const handleBookSessionSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingSuccess(false);
      setBookingDate('');
      setBookingTime('');
      setBookingNotes('');
    }, 2000);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageText = (text) => {
    // Escape HTML tags to prevent XSS
    let cleanText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Markdown bold (**text**)
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // List item lines starting with *, - or •
    cleanText = cleanText.replace(/^[•*-]\s*(.*?)$/gm, '<li>$1</li>');
    // Wrap consecutive list items in <ul>
    cleanText = cleanText.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

    // Convert newlines to breaks
    cleanText = cleanText.split('\n').join('<br />');

    // Check for CTA targets
    const hasAssessmentCta = text.includes('Take Career Assessment');
    const hasSessionCta = text.includes('Book Career Session') || text.includes('Book Career Guidance Session');

    return (
      <div className="chatbot-message-content">
        <div
          dangerouslySetInnerHTML={{ __html: cleanText }}
          style={{ whiteSpace: 'pre-line' }}
        />
        {(hasAssessmentCta || hasSessionCta) && (
          <div className="chat-cta-wrapper" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {hasAssessmentCta && (
              <button
                onClick={() => {
                  if (onAssessmentClick) {
                    onAssessmentClick();
                  } else {
                    navigate('/onboarding');
                  }
                }}
                className="chat-cta-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  border: '1px solid var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(23, 39, 91, 0.15)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; }}
              >
                <Compass size={14} />
                <span>🎯 Take Career Assessment</span>
              </button>
            )}
            {hasSessionCta && (
              <button
                onClick={() => {
                  if (onSessionClick) {
                    onSessionClick();
                  } else {
                    navigate('/onboarding');
                  }
                }}
                className="chat-cta-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(23, 39, 91, 0.15)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(23, 39, 91, 0.05)'; }}
              >
                <Calendar size={14} />
                <span>📅 Book Career Guidance Session</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Reusable inline styles to ensure the component is self-contained and modular
  const styleTag = (
    <style>{`
      .aspireya-chatbot-container.theme-light {
        --chat-bg: var(--color-surface);
        --chat-border: var(--color-border);
        --chat-text: var(--color-text-primary);
        --chat-text-secondary: var(--color-text-secondary);
        --chat-bubble-bot-bg: var(--color-background);
        --chat-bubble-bot-text: var(--color-text-primary);
        --chat-bubble-user-bg: rgba(23, 39, 91, 0.08);
        --chat-bubble-user-text: var(--color-primary);
        --chat-input-panel-bg: var(--color-surface);
        --chat-input-bg: var(--color-background);
        --chat-input-border: var(--color-border);
        --chat-input-text: var(--color-text-primary);
        --chat-action-card-bg: var(--color-surface);
        --chat-action-card-border: var(--color-border);
        --chat-action-card-text: var(--color-text-secondary);
        --chat-action-card-hover-bg: rgba(255, 107, 61, 0.05);
        --chat-action-card-hover-border: var(--color-border);
        --chat-action-card-hover-text: var(--color-primary);
        --chat-reply-pill-bg: var(--color-surface);
        --chat-reply-pill-border: var(--color-border);
        --chat-reply-pill-text: var(--color-text-secondary);
        --chat-time-text: var(--color-text-secondary);
        --chat-header-bg: var(--color-accent-gradient);
        --chat-header-text: #ffffff;
        --chat-header-subtext: #a7f3d0;
        --chat-header-btn-color: rgba(255, 255, 255, 0.8);
        --chat-header-btn-hover-bg: rgba(255, 255, 255, 0.15);
        --chat-header-btn-hover-color: #ffffff;
      }
      .aspireya-chatbot-container.theme-dark {
        --chat-bg: #1e1b4b;
        --chat-border: #312e81;
        --chat-text: #f3f4f6;
        --chat-text-secondary: #cbd5e1;
        --chat-bubble-bot-bg: #312e81;
        --chat-bubble-bot-text: #f3f4f6;
        --chat-bubble-user-bg: var(--color-primary);
        --chat-bubble-user-text: #ffffff;
        --chat-input-panel-bg: #1e1b4b;
        --chat-input-bg: #312e81;
        --chat-input-border: #4338ca;
        --chat-input-text: #f3f4f6;
        --chat-action-card-bg: #312e81;
        --chat-action-card-border: #4338ca;
        --chat-action-card-text: #e2e8f0;
        --chat-action-card-hover-bg: #4338ca;
        --chat-action-card-hover-border: #6366f1;
        --chat-action-card-hover-text: #ffffff;
        --chat-reply-pill-bg: #312e81;
        --chat-reply-pill-border: #4338ca;
        --chat-reply-pill-text: #cbd5e1;
        --chat-time-text: #94a3b8;
        --chat-header-bg: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
        --chat-header-text: #ffffff;
        --chat-header-subtext: #34d399;
        --chat-header-btn-color: rgba(255, 255, 255, 0.8);
        --chat-header-btn-hover-bg: rgba(255, 255, 255, 0.15);
        --chat-header-btn-hover-color: #ffffff;
      }
      .aspireya-chatbot-container {
        font-family: 'Inter', system-ui, sans-serif;
        color: var(--chat-text);
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0px); }
      }
        @keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(23, 39, 91, 0.45);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(23, 39, 91, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(23, 39, 91, 0);
  }
}
      .aspireya-floating-trigger {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 68px;
        height: 68px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
        box-shadow: 0 8px 30px rgba(23, 39, 91, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 999;
        animation:
  float 4s ease-in-out infinite,
  pulseGlow 2.5s infinite;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        overflow: hidden;
      }
      .aspireya-floating-trigger:hover {
        animation-play-state: paused;
        transform: scale(1.1) translateY(-4px);
        box-shadow: 0 12px 35px rgba(23, 39, 91, 0.5);
      }
      .aspireya-floating-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      .aspireya-floating-trigger:hover .aspireya-floating-avatar {
        transform: scale(1.05);
      }
      .aspireya-floating-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 2px solid #FFFFFF;
        z-index: 2;
      }
      .aspireya-floating-tooltip {
        position: fixed;
        bottom: 102px;
        right: 24px;
        background: #ffffff;
        border: 1px solid #E5E7EB;
        border-radius: 12px;
        padding: 10px 14px;
        font-size: 0.82rem;
        color: #1E3A8A;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        white-space: nowrap;
        pointer-events: none;
        z-index: 998;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      }
      .aspireya-floating-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .aspireya-floating-tooltip::after {
        content: '';
        position: absolute;
        bottom: -6px;
        right: 28px;
        border-width: 6px 6px 0;
        border-style: solid;
        border-color: #ffffff transparent;
        display: block;
        width: 0;
      }
      .aspireya-floating-tooltip::before {
        content: '';
        position: absolute;
        bottom: -7px;
        right: 27px;
        border-width: 7px 7px 0;
        border-style: solid;
        border-color: #E5E7EB transparent;
        display: block;
        width: 0;
        z-index: -1;
      }
      .aspireya-chat-window {
        background: var(--chat-bg);
        border: 1px solid var(--chat-border);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .aspireya-chat-window.floating {
        position: fixed;
        bottom: 104px;
        right: 24px;
        width: 390px;
        height: 600px;
        max-height: calc(100vh - 140px);
        border-radius: 16px;
        z-index: 1000;
      }
      .aspireya-chat-window.inline {
        width: 100%;
        height: 100%;
        border-radius: 0px;
      }
      .aspireya-chat-header {
        padding: 18px 20px;
        background: var(--chat-header-bg);
        border-bottom: 1px solid var(--chat-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .aspireya-header-profile {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .aspireya-avatar-bot {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.6);
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        animation: avatarPulse 2.5s infinite;
      }
      .aspireya-avatar-bot img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .aspireya-header-text h4 {
        margin: 0;
        color: var(--chat-header-text);
        font-size: 1rem;
        font-weight: 600;
        font-family: var(--font-heading);
      }
      .aspireya-header-text span {
        font-size: 0.75rem;
        color: var(--chat-header-subtext);
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .aspireya-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .aspireya-header-btn {
        background: transparent;
        border: none;
        color: var(--chat-header-btn-color);
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .aspireya-header-btn:hover {
        background: var(--chat-header-btn-hover-bg);
        color: var(--chat-header-btn-hover-color);
      }
      .aspireya-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .aspireya-msg-wrap {
        display: flex;
        gap: 12px;
        max-width: 85%;
        align-self: flex-start;
      }
      .aspireya-msg-wrap.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }
      .aspireya-msg-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 0.75rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .aspireya-msg-avatar.bot {
        background: #ffffff;
        border: 1px solid #BFDBFE;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .aspireya-msg-avatar.bot img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .aspireya-msg-avatar.user {
        background: #DBEAFE;
        border: 1px solid #93C5FD;
        color: #1D4ED8;
      }
      .aspireya-msg-bubble {
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 0.92rem;
        line-height: 1.5;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
      }
      .aspireya-msg-wrap.bot .aspireya-msg-bubble {
        background: var(--chat-bubble-bot-bg);
        border: none;
        color: var(--chat-bubble-bot-text);
        border-top-left-radius: 4px;
      }
      .aspireya-msg-wrap.user .aspireya-msg-bubble {
        background: var(--chat-bubble-user-bg);
        border: none;
        color: var(--chat-bubble-user-text);
        border-top-right-radius: 4px;
      }
      .aspireya-msg-time {
        font-size: 0.7rem;
        color: var(--chat-time-text);
        margin-top: 4px;
        align-self: flex-start;
      }
      .aspireya-msg-wrap.user .aspireya-msg-time {
        align-self: flex-end;
      }
      .aspireya-welcome-actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        width: 100%;
        margin-top: 12px;
      }
      .aspireya-action-card {
        background: var(--chat-action-card-bg);
        border: 1px solid var(--chat-action-card-border);
        border-radius: 8px;
        padding: 10px 14px;
        font-size: 0.78rem;
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--chat-action-card-text);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
      }
     .aspireya-action-card:hover {
  background: var(--chat-action-card-hover-bg);
  border-color: var(--chat-action-card-hover-border);
  color: var(--chat-action-card-hover-text);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 24px rgba(0,0,0,0.12);
}
      .aspireya-replies-list {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        padding: 8px 16px;
        background: transparent;
      }
      .aspireya-reply-pill {
        background: var(--chat-reply-pill-bg);
        border: 1px solid var(--chat-reply-pill-border);
        color: var(--chat-reply-pill-text);
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 0.78rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .aspireya-reply-pill:hover {
        background: var(--chat-action-card-hover-bg);
        border-color: var(--chat-action-card-hover-border);
        color: var(--chat-action-card-hover-text);
      }
      .aspireya-input-panel {
        padding: 12px 16px 12px 16px;
        background: var(--chat-input-panel-bg);
        border-top: 1px solid var(--chat-border);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .aspireya-input-form {
        display: flex;
        align-items: center;
        padding: 4px 6px;
        background: var(--chat-input-bg);
        border: 1px solid var(--chat-input-border);
        border-radius: 24px;
        transition: all 0.2s ease;
      }
      .aspireya-input-form:focus-within {
        border-color: var(--color-primary);
        background: var(--chat-bg);
        box-shadow: 0 0 0 3px rgba(23, 39, 91, 0.15);
      }
      .aspireya-input-field {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--chat-input-text);
        padding: 8px 14px;
        font-size: 0.9rem;
      }
      .aspireya-submit-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--color-accent-gradient);
        border: none;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(23, 39, 91, 0.25);
      }
      .aspireya-submit-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(23, 39, 91, 0.35);
      }
      .aspireya-submit-btn:disabled {
        background: #E5E7EB;
        color: #9CA3AF;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
      }
      .aspireya-powered-by {
        font-size: 0.72rem;
        color: var(--chat-time-text);
        text-align: center;
        margin-top: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
      .chatbot-message-content ul {
        margin: 8px 0;
        padding-left: 16px;
      }
      .chatbot-message-content li {
        margin: 4px 0;
      }
      
      /* Self-contained session modal overlay in popup */
      .aspireya-local-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.3);
        backdrop-filter: blur(4px);
        z-index: 1010;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .aspireya-modal-card {
        background: var(--chat-bg);
        border: 1px solid var(--chat-border);
        border-radius: 12px;
        width: 100%;
        max-width: 340px;
        padding: 20px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      }
      .aspireya-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        color: var(--chat-text);
      }
      .aspireya-modal-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }
      .aspireya-form-grp {
        margin-bottom: 12px;
      }
      .aspireya-form-grp label {
        display: block;
        font-size: 0.75rem;
        color: var(--chat-text-secondary);
        margin-bottom: 4px;
      }
      .aspireya-form-ctrl {
        width: 100%;
        padding: 8px 10px;
        background: var(--chat-input-bg);
        border: 1px solid var(--chat-input-border);
        border-radius: 6px;
        color: var(--chat-text);
        font-size: 0.82rem;
        outline: none;
      }
      .aspireya-form-ctrl:focus {
        border-color: var(--color-primary);
      }
      .aspireya-modal-submit-btn {
        width: 100%;
        padding: 10px;
        background: var(--color-primary);
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        margin-top: 8px;
        transition: background 0.2s ease;
      }
      .aspireya-modal-submit-btn:hover {
        background: var(--color-primary-hover);
      }
      .typing-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes avatarPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 107, 61, 0.45);
  }

  70% {
    box-shadow: 0 0 0 12px rgba(255, 107, 61, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 61, 0);
  }
}

      @media (max-width: 480px) {
        .aspireya-chat-window.floating {
          bottom: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-height: 100vh !important;
          border-radius: 0px !important;
        }
      }
    `}</style>
  );

  const renderWelcomeScreen = (msg, idx) => {
    // If it's the welcome message (index 0) and the only one in local state
    if (idx === 0 && messages.length === 1) {
      // Personalize greeting if user profile context has a name
      const name = userProfile?.displayName || userProfile?.name || '';
      const greeting = name ? `Hello ${name}! I'm Aspireya AI` : "Hello! I'm Aspireya AI";

      const welcomeText = `👋 Welcome to Aspireya Consulting!\n\n${greeting}, your Career Guidance Assistant.\n\nI can help you with:\n\n• Career Guidance\n• Stream Selection\n• Courses\n• Colleges\n• Entrance Exams\n• Skills\n• Higher Education\n• Career Opportunities\n\nHow can I help you today?`;

      return (
        <div key={idx} className="aspireya-msg-wrap bot">
          <div className="aspireya-msg-avatar bot">
            <img src={chatbotAvatar} alt="AI" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            <div className="aspireya-msg-bubble message-wrapper ai-msg">
              {renderMessageText(welcomeText)}
            </div>

            <div className="aspireya-welcome-actions">
              {quickActions.map((action, aIdx) => (
                <button
                  key={aIdx}
                  onClick={() => handleSend(action.query)}
                  className="aspireya-action-card"
                >
                  <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                    {action.icon}
                  </span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
            <span className="aspireya-msg-time">{formatTime(msg.timestamp)}</span>
          </div>
        </div>
      );
    }

    const isAi = msg.sender === 'ai';
    return (
      <motion.div
        key={idx}
        className={`aspireya-msg-wrap ${isAi ? 'bot' : 'user'}`}
        initial={{
          opacity: 0,
          x: isAi ? -30 : 30,
          y: 10
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut"
        }}
      >
        <div className={`aspireya-msg-avatar ${isAi ? 'bot' : 'user'}`}>
          {isAi ? <img src={chatbotAvatar} alt="AI" /> : 'ME'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <motion.div
            className="aspireya-msg-bubble"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 20
            }}
          >
            {renderMessageText(msg.text)}
          </motion.div>
        </div>
        <span className="aspireya-msg-time">{formatTime(msg.timestamp)}</span>

      </motion.div>
    );
  };

  const chatContainer = (
    <div className={`aspireya-chat-window ${isFloating ? 'floating' : 'inline'}`}>
      {/* Header */}
      <div className="aspireya-chat-header">
        <div className="aspireya-header-profile">
          <div className="aspireya-avatar-bot">
            <img src={chatbotAvatar} alt="AI Avatar" />
          </div>
          <div className="aspireya-header-text">
            <div style={{ background: '#ffffff', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '2px' }}>
              <img src={logo} alt="Aspireya Logo" className="chatbot-header-logo" style={{ height: '30px', width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
            <span>
              <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
              Online Mentor
            </span>
          </div>
        </div>

        <div className="aspireya-header-actions">
          <button onClick={toggleTheme} title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'} className="aspireya-header-btn">
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <button onClick={handleClearHistory} title="Clear conversation" className="aspireya-header-btn">
            <Trash2 size={15} />
          </button>
          {isFloating && (
            <>
              <button onClick={() => setIsOpen(false)} title="Minimize" className="aspireya-header-btn">
                <Minus size={15} />
              </button>
              <button onClick={() => setIsOpen(false)} title="Close" className="aspireya-header-btn">
                <X size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="aspireya-chat-body">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          messages.map((msg, idx) => renderWelcomeScreen(msg, idx))
        )}

        {submitting && (
          <div className="aspireya-msg-wrap bot">
            <div className="aspireya-msg-avatar bot">
              <img src={chatbotAvatar} alt="AI" />
            </div>
            <div className="aspireya-msg-bubble" style={{ padding: '10px 14px' }}>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Replies */}
      {!submitting && messages.length > 1 && (
        <div className="aspireya-replies-list">
          {quickReplies.map((reply, rIdx) => (
            <button
              key={rIdx}
              className="aspireya-reply-pill"
              onClick={() => handleSend(reply)}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <div className="aspireya-input-panel">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="aspireya-input-form"
        >
          <input
            type="text"
            className="aspireya-input-field"
            placeholder="Ask about careers, skills, courses..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={submitting}
          />
          <motion.button
            type="submit"
            className="aspireya-submit-btn"
            disabled={!inputText.trim() || submitting}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15
            }}
          >
            <Send size={15} />
          </motion.button>
        </form>
        <div className="aspireya-powered-by">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Powered by <img src={logo} alt="Aspireya Logo" className="powered-by-logo" style={{ height: '14px', width: 'auto', objectFit: 'contain', verticalAlign: 'middle' }} />
          </span>
          <Sparkles size={10} style={{ color: 'var(--color-primary)' }} />
        </div>
      </div>

      {/* Self-contained Session Booking Modal inside the chat panel */}
      {showBookingModal && (
        <div className="aspireya-local-modal">
          <div className="aspireya-modal-card">
            <div className="aspireya-modal-header">
              <h3>Book Career Session</h3>
              <button
                className="aspireya-header-btn"
                onClick={() => setShowBookingModal(false)}
                style={{ padding: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '50%', color: '#10b981' }}>
                  <CheckCircle size={28} />
                </div>
                <h4 style={{ color: 'white', margin: 0, fontSize: '0.95rem' }}>Session Requested!</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
                  A career expert from Aspireya Consulting will connect with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSessionSubmit}>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Connect with a professional career expert from **Aspireya Consulting** for one-to-one counseling.
                </p>

                <div className="aspireya-form-grp">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    className="aspireya-form-ctrl"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="aspireya-form-grp">
                  <label>Preferred Time Slot</label>
                  <select
                    className="aspireya-form-ctrl"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Slot --</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                    <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <div className="aspireya-form-grp">
                  <label>Topics / Special Notes</label>
                  <textarea
                    className="aspireya-form-ctrl"
                    rows="2"
                    placeholder="e.g. Science vs Commerce tracks..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button type="submit" className="aspireya-modal-submit-btn">
                  Confirm Booking Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`aspireya-chatbot-container theme-${theme}`}>
      {styleTag}

      {isFloating ? (
        <>
          {/* Bubble Trigger */}
          <div
            className="aspireya-floating-trigger"
            onClick={() => {
              setIsOpen(!isOpen);
              setShowTooltip(false);
            }}
          >
            <img src={chatbotAvatar} alt="Aspireya AI Avatar" className="aspireya-floating-avatar" />
            {unreadCount > 0 && (
              <div className="aspireya-floating-badge">{unreadCount}</div>
            )}
          </div>

          {/* Interactive Tooltip */}
          <div className={`aspireya-floating-tooltip ${showTooltip && !isOpen ? 'visible' : ''}`}>
            <span>Click here to chat with Aspireya AI ✨</span>
          </div>

          {/* Toggleable Panel */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 60,
                  scale: 0.85
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  y: 60,
                  scale: 0.85
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22
                }}
                style={{
                  position: 'fixed',
                  bottom: '104px',
                  right: '24px',
                  zIndex: 1000
                }}
              >
                {chatContainer}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        chatContainer
      )}
    </div>
  );
};

export default CareerChatbot;
