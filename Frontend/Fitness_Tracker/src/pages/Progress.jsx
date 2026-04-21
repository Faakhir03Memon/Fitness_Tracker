import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Award, Calendar, ChevronRight, Activity, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Progress = () => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState([]);
  const [goals, setGoals] = useState([
    { name: 'Weight Loss', pct: 72, color: 'var(--accent-green)', icon: <TrendingUp size={16}/> },
    { name: 'Muscle Gain', pct: 58, color: 'var(--accent-cyan)', icon: <Activity size={16}/> },
    { name: 'Endurance', pct: 85, color: 'var(--accent-purple)', icon: <Award size={16}/> },
    { name: 'Flexibility', pct: 40, color: 'var(--accent-orange)', icon: <Calendar size={16}/> }
  ]);

  const authConfig = {
    headers: { Authorization: `Bearer ${user.token}` }
  };

  useEffect(() => {
    const fetchProgress = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/stats/range/weekly', authConfig);
            
            const data = res.data.length > 0 ? res.data.map(item => ({
              day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
              val: Math.min(((item.caloriesBurned || 0) / 3000) * 100, 100) || Math.floor(Math.random() * 40) + 30
            })) : [
                { day: 'Mon', val: 80 }, { day: 'Tue', val: 60 }, { day: 'Wed', val: 90 },
                { day: 'Thu', val: 45 }, { day: 'Fri', val: 70 }, { day: 'Sat', val: 55 },
                { day: 'Sun', val: 100 }
            ];
            setWeeklyData(data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchProgress();
  }, []);

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1 style={{fontFamily: 'Bebas Neue', fontSize: '48px', letterSpacing: '3px'}}>PROGRESS ANALYTICS</h1>
          <p>Visualize your evolution and crush your milestones</p>
        </div>
      </div>

      <div className="mid-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="progress-section" style={{padding: '40px'}}>
          <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
             <div className="section-title" style={{fontFamily: 'Bebas Neue', fontSize: '24px', letterSpacing: '1px'}}>WEEKLY ACTIVITY INTENSITY</div>
             <div className="section-tag" style={{background: 'rgba(0, 255, 137, 0.1)', color: 'var(--accent-green)', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: '800'}}>Elite Performance</div>
          </div>
          <div className="weekly-bars" style={{height: '250px'}}>
            {weeklyData.map((d, i) => (
              <div key={i} className="day-col">
                <div className="day-bar-wrap" style={{width: '60px'}}>
                  <div 
                    className="day-bar" 
                    style={{ height: `${d.val}%`, background: `linear-gradient(to top, var(--accent-green), var(--accent-cyan))` }}
                  ></div>
                </div>
                <div className="day-label" style={{fontWeight: '700', fontSize: '13px'}}>{d.day?.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-label"><Target size={16} style={{marginRight: '8px'}}/> MONTHLY GOALS TRACKER</div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {goals.map((goal, i) => (
            <div key={i} className="stat-card" style={{borderLeft: `4px solid ${goal.color}`}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <div className="stat-label" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {goal.icon} {goal.name.toUpperCase()}
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </div>
                <div className="stat-value" style={{color: goal.color}}>{goal.pct}%</div>
                <div className="goal-bar-bg" style={{marginTop: '15px', height: '8px'}}>
                    <div className="goal-bar-fill" style={{ width: `${goal.pct}%`, background: goal.color }}></div>
                </div>
                <div style={{fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', fontWeight: '600'}}>
                    Approx. {Math.round(goal.pct * 0.3)} days remaining to target
                </div>
            </div>
        ))}
      </div>

      <style>{`
        .day-bar-wrap:hover .day-bar { filter: brightness(1.2); }
      `}</style>
    </main>
  );
};

export default Progress;
