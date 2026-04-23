import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Show splash for 3 seconds, then start fade out
    const timer = setTimeout(() => {
      setIsFading(true);
      // Wait for fade animation to complete
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 800);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <h1 className="splash-logo">FITTRACK</h1>
        <p className="splash-tagline">Evolution in Motion</p>
        
        <div style={{ marginTop: '20px' }}>
          <Loader text="Preparing your journey" />
        </div>
      </div>
      
      <div className="splash-footer">
        POWERED BY ADVANCED ANALYTICS
      </div>
    </div>
  );
};

export default SplashScreen;
