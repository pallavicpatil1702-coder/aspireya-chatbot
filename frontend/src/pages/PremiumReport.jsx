import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PremiumReport = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/report', { replace: true });
  }, [navigate]);

  return null;
};

export default PremiumReport;
