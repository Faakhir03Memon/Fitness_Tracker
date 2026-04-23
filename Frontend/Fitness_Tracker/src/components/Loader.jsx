import React from 'react';
import './Loader.css';

const Loader = ({ text = "Pushing Limits" }) => {
  return (
    <div className="loader-container">
      <div className="running-person">
        <svg viewBox="0 0 64 64">
          {/* Head */}
          <circle cx="32" cy="12" r="4" />
          
          {/* Body and Limbs */}
          <g className="body-group">
            {/* Torso */}
            <path d="M32 16 L32 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            
            {/* Back Arm */}
            <g className="arm-back">
              <path d="M32 18 L24 28" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </g>
            
            {/* Front Arm */}
            <g className="arm-front">
              <path d="M32 18 L40 28" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </g>
            
            {/* Back Leg */}
            <g className="leg-back">
              <path d="M32 32 L24 48 L18 52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
            
            {/* Front Leg */}
            <g className="leg-front">
              <path d="M32 32 L40 48 L46 52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
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
