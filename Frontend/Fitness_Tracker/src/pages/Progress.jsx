import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Progress = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [goals, setGoals] = useState([
    { name: 'Weight Loss', pct: 72, color: 'var(--accent-green)' },
    { name: 'Muscle Gain', pct: 58, color: 'var(--accent-cyan)' },
    { name: 'Endurance', pct: 85, color: 'var(--accent-purple)' },
    { name: 'Flexibility', pct: 40, color: 'var(--accent-orange)' }
  ]);

  useEffect(() => {
    // In a real app, fetch from /api/stats/range/weekly
    const mockData = [
      { day: 'Mon', val: 80 }, { day: 'Tue', val: 60 }, { day: 'Wed', val: 90 },
      { day: 'Thu', val: 45 }, { day: 'Fri', val: 70 }, { day: 'Sat', val: 55 },
      { day: 'Sun', val: 100 }
    ];
    setWeeklyData(mockData);
  }, []);

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>Track Your Progress</h1>
          <p>Analysis of your weekly and monthly performance</p>
        </div>
      </div>

      <div className="mid-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="progress-section">
          <div className="section-header">
            <div className="section-title">WEEKLY ACTIVITY INTENSITY</div>
            <div className="section-tag">Performance</div>
          </div>
          <div className="weekly-bars">
            {weeklyData.map((d, i) => (
              <div key={i} className="day-col">
                <div className="day-bar-wrap">
                  <div 
                    className={`day-bar ${i === 0 ? 'today' : ''}`} 
                    style={{ height: `${d.val}%`, transitionDelay: `${i * 0.1}s` }}
                  ></div>
                </div>
                <div className={`day-label ${i === 0 ? 'today' : ''}`}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-label">Monthly Goals Status</div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        <div className="goals-panel" style={{ width: '100%' }}>
          {goals.map((goal, i) => (
            <div key={i} className="goal-item">
              <div className="goal-header">
                <span className="goal-name">{goal.name}</span>
                <span className="goal-pct" style={{ color: goal.color }}>{goal.pct}%</span>
              </div>
              <div className="goal-bar">
                <div 
                  className="goal-fill" 
                  style={{ 
                    width: `${goal.pct}%`, 
                    background: `linear-gradient(to right, ${goal.color}, rgba(255,255,255,0.1))`,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Progress;
