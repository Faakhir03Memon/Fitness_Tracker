import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Play } from 'lucide-react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/workouts');
        setWorkouts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>Training Log</h1>
          <p>Every rep counts. Track your history and personal records.</p>
        </div>
      </div>

      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search workouts..." 
              style={{ paddingLeft: '45px', background: 'var(--bg-card)' }}
            />
          </div>
          <button className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="section-label">All Activities</div>
      <div className="workout-grid">
        {loading ? (
          <p>Loading your sweat session history...</p>
        ) : (
          workouts.map((w, i) => (
            <div key={i} className="workout-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div className="wc-title">{w.type}</div>
                <div className="section-tag" style={{ border: '1px solid var(--accent-green)', color: 'var(--accent-green)' }}>Completed</div>
              </div>
              
              <div className="wc-meta">
                {new Date(w.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>

              <div className="wc-stats">
                <div className="wc-stat">
                  <div className="n">{w.duration}</div>
                  <div className="u">Mins</div>
                </div>
                <div className="wc-stat">
                  <div className="n">{w.calories}</div>
                  <div className="u">Kcal</div>
                </div>
              </div>

              {w.notes && (
                <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  "{w.notes}"
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="section-label" style={{ marginTop: '40px' }}>Recommended for Today</div>
      <div className="workout-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <SuggestionCard title="High Intensity Interval" time="25 mins" cals="350" color="var(--accent-purple)" />
        <SuggestionCard title="Mobility & Stretching" time="15 mins" cals="80" color="var(--accent-orange)" />
      </div>
    </main>
  );
};

const SuggestionCard = ({ title, time, cals, color }) => (
  <div className="workout-card" style={{ background: `linear-gradient(45deg, var(--bg-card), rgba(255,255,255,0.02))` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div className="wc-title">{title}</div>
        <div className="wc-meta" style={{ marginBottom: '0' }}>{time} • {cals} Kcal</div>
      </div>
      <button className="add-btn" style={{ position: 'static', width: '40px', height: '40px', background: color }}>
        <Play size={18} fill="#000" />
      </button>
    </div>
  </div>
);

export default Workouts;
