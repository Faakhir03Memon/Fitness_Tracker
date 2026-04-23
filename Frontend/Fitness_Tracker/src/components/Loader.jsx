import React from 'react';
import './Loader.css';

const Loader = ({ text = "Pushing Limits" }) => {
  return (
    <div className="loader-container">
      {/* Background Energy Ripples */}
      <div className="energy-ring"></div>
      <div className="energy-ring"></div>
      <div className="energy-ring"></div>

      <div className="running-person">
        {/* Circular Progress Ring */}
        <svg className="progress-ring">
          <circle cx="90" cy="90" r="85" />
          <circle cx="90" cy="90" r="85" className="progress-bar" />
        </svg>

        {/* The Professional Runner */}
        <svg viewBox="0 0 64 64" className="runner-svg">
          <defs>
            <linearGradient id="runner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff87" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
          
          <g className="runner-torso">
            <circle cx="35" cy="10" r="5" fill="url(#runner-gradient)" />
            <path d="M28 15 Q35 14 42 15 L40 35 Q34 38 28 35 Z" fill="url(#runner-gradient)" />
            
            <g className="runner-arm-back" style={{ opacity: 0.5 }}>
              <path d="M30 18 L18 32 L25 38" stroke="url(#runner-gradient)" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
            
            <g className="runner-arm-front">
              <path d="M38 18 L50 30 L42 40" stroke="url(#runner-gradient)" strokeWidth="7" strokeLinecap="round" fill="none" />
            </g>
          </g>

          <g className="runner-leg-back" style={{ opacity: 0.5 }}>
            <path d="M32 35 L22 52 L12 55" stroke="url(#runner-gradient)" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
          
          <g className="runner-leg-front">
            <path d="M32 35 L42 55 L52 60" stroke="url(#runner-gradient)" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
        </svg>

        {/* Dynamic Shadow */}
        <div className="runner-shadow"></div>
      </div>
      
      <div className="loader-info">
        <div className="loader-text">{text}</div>
        <div className="loader-status">System Optimization Active</div>
      </div>
    </div>
  );
};

export default Loader;
