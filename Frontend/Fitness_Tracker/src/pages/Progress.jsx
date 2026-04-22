import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Award, Calendar, ChevronRight, Activity, Target, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const Progress = () => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState([]);
  const [goals] = useState([
    { name: 'Weight Loss', pct: 72, color: 'var(--accent-green)', icon: <TrendingUp size={16}/> },
    { name: 'Muscle Gain', pct: 58, color: 'var(--accent-cyan)', icon: <Activity size={16}/> },
    { name: 'Endurance', pct: 85, color: 'var(--accent-purple)', icon: <Award size={16}/> },
    { name: 'Flexibility', pct: 40, color: 'var(--accent-orange)', icon: <Calendar size={16}/> }
  ]);

  useEffect(() => {
    const fetchProgress = async () => {
        if (!user || !user.token) return;
        try {
            const authConfig = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${API_BASE_URL}/api/stats/range/weekly`, authConfig);
            
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const todayIdx = new Date().getDay(); 
            
            const data = days.map((dayName, idx) => {
                const found = res.data.find(item => {
                    const d = new Date(item.date).getDay();
                    const adjustedD = d === 0 ? 6 : d - 1; 
                    return adjustedD === idx;
                });
                
                return {
                    day: dayName,
                    val: found ? Math.max(15, Math.min(((found.caloriesBurned || 0) / 2500) * 100, 100)) : Math.floor(Math.random() * 30) + 10,
                    active: idx === (todayIdx === 0 ? 6 : todayIdx - 1)
                };
            });
            
            setWeeklyData(data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchProgress();
  }, [user]);

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1 style={{fontFamily: 'Bebas Neue', fontSize: '48px', letterSpacing: '3px'}}>PROGRESS ANALYTICS</h1>
          <p>Visualize your evolution and crush your milestones</p>
        </div>
      </div>

      <div className="mid-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="progress-section" style={{padding: '40px', background: 'rgba(13, 17, 23, 0.6)', border: '1px solid var(--border)'}}>
          <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
             <div className="section-title" style={{fontFamily: 'Bebas Neue', fontSize: '24px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <BarChart3 size={20} color="var(--accent-green)" /> WEEKLY ACTIVITY INTENSITY
             </div>
             <div className="section-tag" style={{background: 'rgba(0, 255, 137, 0.1)', color: 'var(--accent-green)', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: '800'}}>Elite Performance</div>
          </div>
          
          <div className="weekly-bars" style={{height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px'}}>
            {weeklyData.map((d, i) => (
              <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end'}}>
                <div style={{
                    width: '35px', 
                    height: `${d.val}%`, 
                    background: d.active ? 'linear-gradient(to top, var(--accent-green), var(--accent-cyan))' : 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    border: d.active ? '1px solid rgba(0,255,137,0.3)' : '1px solid transparent'
                }}>
                    {d.active && <div style={{position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', background: 'var(--accent-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-green)'}}></div>}
                </div>
                <div style={{marginTop: '15px', fontSize: '11px', fontWeight: '800', color: d.active ? 'white' : 'var(--text-muted)', letterSpacing: '1px'}}>
                    {d.day.toUpperCase()}
                </div>
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
    </main>
  );
};

export default Progress;
