import React from 'react';
import './Loader.css';

const Loader = ({ text = "Pushing Limits" }) => {
  return (
    <div className="loader-container">
      <div className="running-person">
        <svg viewBox="0 0 64 64" className="runner-svg">
          <defs>
            <linearGradient id="runner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-green)" />
              <stop offset="100%" stopColor="var(--accent-cyan)" />
            </linearGradient>
          </defs>
          
          <g className="runner-torso">
            {/* Athletic Head */}
            <circle cx="35" cy="10" r="5" />
            
            {/* Muscular Torso */}
            <path d="M28 15 Q35 14 42 15 L40 35 Q34 38 28 35 Z" />
            
            {/* Back Arm */}
            <g className="runner-arm-back" style={{ opacity: 0.6 }}>
              <path d="M30 18 L20 30 L25 35" stroke="url(#runner-gradient)" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
            
            {/* Front Arm */}
            <g className="runner-arm-front">
              <path d="M38 18 L48 28 L42 38" stroke="url(#runner-gradient)" strokeWidth="7" strokeLinecap="round" fill="none" />
            </g>
          </g>

          {/* Back Leg */}
          <g className="runner-leg-back" style={{ opacity: 0.6 }}>
            <path d="M32 35 L25 50 L15 55" stroke="url(#runner-gradient)" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
          
          {/* Front Leg */}
          <g className="runner-leg-front">
            <path d="M32 35 L40 52 L50 58" stroke="url(#runner-gradient)" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>
      
      <div className="loader-text">{text}</div>
      
      <div className="loading-bar-container">
        <div className="loading-bar-progress"></div>
      </div>
    </div>
  );
};

export default Loader;
