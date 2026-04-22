import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Play, Clock, Flame, Dumbbell, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const Workouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const authConfig = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_BASE_URL}/api/workouts`, authConfig);
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
          <h1 style={{fontFamily: 'Bebas Neue', fontSize: '48px', letterSpacing: '3px'}}>TRAINING LOG</h1>
          <p>Every rep counts. Your complete fitness journey in one place.</p>
        </div>
      </div>

      <div className="search-bar-wrap" style={{ marginBottom: '40px', display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by workout type or notes..." 
              style={{ paddingLeft: '50px', height: '56px', borderRadius: '18px', border: '1px solid var(--border)' }}
            />
          </div>
          <button className="premium-filter-btn">
            <Filter size={18} /> Filters
          </button>
      </div>

      <div className="section-label"><History size={16} style={{marginRight: '8px'}} /> ALL ACTIVITIES</div>
      <div className="workout-list-container">
        {loading ? (
             <div className="workout-card" style={{textAlign: 'center', padding: '40px'}}>
                <Dumbbell className="animate-spin" style={{margin: '0 auto 15px', color: 'var(--accent-green)'}} />
                <p>Loading your training data...</p>
             </div>
        ) : workouts.length > 0 ? workouts.map((w, i) => (
             <DetailedWorkoutCard key={i} workout={w} />
        )) : (
            <div className="workout-card" style={{textAlign: 'center', padding: '60px', borderStyle: 'dashed'}}>
                <Dumbbell size={48} style={{color: 'var(--text-muted)', marginBottom: '20px', opacity: 0.3}} />
                <p style={{color: 'var(--text-muted)', fontWeight: '600'}}>No workouts logged yet. Your hard work will appear here.</p>
            </div>
        )}
      </div>

      <div className="section-label" style={{ marginTop: '50px' }}>RECOMMENDED FOR TODAY</div>
      <div className="workout-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        <SuggestionCard title="High Intensity Interval" time="25 mins" cals="350" color="var(--accent-purple)" />
        <SuggestionCard title="Mobility & Stretching" time="15 mins" cals="80" color="var(--accent-orange)" />
      </div>

      <style>{`
        .premium-filter-btn {
            background: var(--bg-card); border: 1px solid var(--border);
            color: white; padding: 0 25px; border-radius: 18px;
            display: flex; align-items: center; gap: 10px; cursor: pointer;
            transition: 0.3s; font-weight: 600;
        }
        .premium-filter-btn:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
        
        .detailed-workout-card {
            background: var(--bg-card); border: 1px solid var(--border);
            border-radius: 20px; padding: 25px; margin-bottom: 20px;
            display: grid; grid-template-columns: 1fr 1fr auto; align-items: center;
            transition: 0.3s;
        }
        .detailed-workout-card:hover { border-color: rgba(0, 255, 137, 0.2); background: rgba(255,255,255,0.02); }
        
        .dw-title { font-family: 'Bebas Neue'; font-size: 26px; letter-spacing: 1px; color: white; display: flex; align-items: center; gap: 12px; }
        .dw-date { font-size: 13px; color: var(--text-muted); font-weight: 600; margin-top: 4px; }
        .dw-metrics { display: flex; gap: 30px; }
        .dw-metric { display: flex; align-items: center; gap: 8px; }
        .dw-metric span { font-weight: 700; font-size: 18px; }
        .dw-status { background: rgba(0, 255, 137, 0.1); color: var(--accent-green); padding: 6px 15px; border-radius: 20px; font-size: 11px; font-weight: 800; border: 1px solid rgba(0, 255, 137, 0.2); }
      `}</style>
    </main>
  );
};

const DetailedWorkoutCard = ({ workout }) => (
    <div className="detailed-workout-card">
        <div>
            <div className="dw-title">{workout.type.toUpperCase()}</div>
            <div className="dw-date">{new Date(workout.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div className="dw-metrics">
            <div className="dw-metric">
                <Clock size={18} color="var(--accent-green)" />
                <span>{workout.duration} <small style={{fontSize: '10px', color: 'var(--text-muted)'}}>MINS</small></span>
            </div>
            <div className="dw-metric">
                <Flame size={18} color="var(--accent-orange)" />
                <span>{workout.calories} <small style={{fontSize: '10px', color: 'var(--text-muted)'}}>KCAL</small></span>
            </div>
        </div>
        <div className="dw-status">COMPLETED</div>
    </div>
);

const SuggestionCard = ({ title, time, cals, color }) => (
  <div className="workout-card" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: `${color}10`, borderRadius: '50%' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div>
        <div className="wc-title" style={{fontFamily: 'Bebas Neue', fontSize: '24px'}}>{title.toUpperCase()}</div>
        <div className="wc-meta" style={{ marginBottom: '0', fontWeight: '600' }}>{time} • {cals} Kcal</div>
      </div>
      <button className="add-btn" style={{ position: 'static', width: '45px', height: '45px', background: color, color: '#000' }}>
        <Play size={20} fill="#000" />
      </button>
    </div>
  </div>
);

export default Workouts;
