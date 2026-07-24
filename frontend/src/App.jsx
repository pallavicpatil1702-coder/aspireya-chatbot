import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Assessment from './pages/Assessment.jsx';
import Report from './pages/Report.jsx';
import Premium from './pages/Premium.jsx';
import PremiumReport from './pages/PremiumReport.jsx';
import CareerChatbot from './components/CareerChatbot.jsx';
import MyReports from './pages/MyReports.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/report" element={<Report isPremiumRoute={false} />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/report/premium" element={<Report isPremiumRoute={true} />} />
          <Route path="/premium-report" element={<Report isPremiumRoute={true} />} />
          <Route path="/my-reports" element={<MyReports />} />
        </Routes>
        <CareerChatbot isFloating={true} />
      </div>
    </Router>
  );
}

export default App;
