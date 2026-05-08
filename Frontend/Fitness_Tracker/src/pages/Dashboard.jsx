import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Flame, Clock, Footprints, Droplets, Target, Activity, GlassWater, Footprints as StepsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    calories: 0,
    minutes: 0,
    steps: 0,
    water: 0
  });

  const [goals, setGoals] = useState({
    weightLoss: 0,
    muscleGain: 0,
    endurance: 0,
    flexibility: 0
  });

  const [workouts, setWorkouts] = useState([]);
  const [weeklyBars, setWeeklyBars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' or 'daily'
  
  const [newWorkout, setNewWorkout] = useState({ type: '', duration: '', calories: '', notes: '' });
  const [dailyStats, setDailyStats] = useState({ steps: '', waterGlasses: 0 });

  const authConfig = {
    headers: { Authorization: `Bearer ${user.token}` }
  };

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    if (!user || !user.token) return;
    try {
      const date = new Date().toISOString().split('T')[0];
      const [statsRes, workoutsRes, weeklyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/stats/${date}`, authConfig),
        axios.get(`${API_BASE_URL}/api/workouts`, authConfig),
        axios.get(`${API_BASE_URL}/api/stats/range/weekly`, authConfig)
      ]);

      setStats({
        calories: statsRes.data.caloriesBurned || 0,
        minutes: statsRes.data.activeMinutes || 0,
        steps: statsRes.data.steps || 0,
        water: statsRes.data.water || 0
      });
      
      setDailyStats({
          steps: statsRes.data.steps || '',
          waterGlasses: Math.round((statsRes.data.water || 0) / 0.25)
      });
      
      setWorkouts(workoutsRes.data.slice(0, 3));
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d;
      });

      const chartData = last7Days.map(dateObj => {
          const dateStr = dateObj.toISOString().split('T')[0];
          const found = weeklyRes.data.find(item => item.date && item.date.startsWith(dateStr));
          const calories = found ? found.caloriesBurned || 0 : 0;
          return {
              day: days[dateObj.getDay()],
              height: Math.min((calories / 1000) * 100, 100)
          };
      });

      setWeeklyBars(chartData);

      const allWorkouts = workoutsRes.data;
      const cardioCount = allWorkouts.filter(w => w.type === 'Cardio' || w.type === 'HIIT').length;
      const strengthCount = allWorkouts.filter(w => w.type === 'Strength Training').length;
      const yogaCount = allWorkouts.filter(w => w.type === 'Yoga').length;
      const totalDuration = allWorkouts.reduce((acc, w) => acc + Number(w.duration || 0), 0);
      
      setGoals({
          weightLoss: Math.min(Math.round((cardioCount / 10) * 100), 100) || 0,
          muscleGain: Math.min(Math.round((strengthCount / 12) * 100), 100) || 0,
          endurance: Math.min(Math.round((totalDuration / 600) * 100), 100) || 0,
          flexibility: Math.min(Math.round((yogaCount / 5) * 100), 100) || 0
      });

    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  const handleSaveWorkout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/workouts`, newWorkout, authConfig);
      setIsModalOpen(false);
      setNewWorkout({ type: '', duration: '', calories: '', notes: '' });
      fetchInitialData();
    } catch (err) {
      console.error("Error saving workout", err);
    }
  };

  const handleUpdateDaily = async () => {
      try {
          const date = new Date().toISOString().split('T')[0];
          const waterLiters = dailyStats.waterGlasses * 0.25;
          await axios.post(`${API_BASE_URL}/api/stats/update`, {
              date,
              steps: Number(dailyStats.steps),
              water: waterLiters
          }, authConfig);
          setIsModalOpen(false);
          fetchInitialData();
      } catch (err) {
          console.error("Error updating daily stats", err);
      }
  };

  const addGlassOfWater = async () => {
      try {
          const date = new Date().toISOString().split('T')[0];
          const newWater = stats.water + 0.25;
          await axios.post(`${API_BASE_URL}/api/stats/update`, {
              date,
              water: newWater
          }, authConfig);
          fetchInitialData();
      } catch (err) {
          console.error("Error adding water", err);
      }
  };

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>WELCOME, {user?.name?.split(' ')[0].toUpperCase()}</h1>
          <p>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div style={{display: 'flex', gap: '15px'}}>
            <button className="nav-item" onClick={addGlassOfWater} style={{background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 212, 255, 0.2)', width: 'auto', padding: '0 15px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold'}}>
                <GlassWater size={16} style={{marginRight: '8px'}} /> + Glass
            </button>
            <div className="topbar-right">
                <div className="avatar" style={{ marginLeft: '10px', ...(user?.avatar ? { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}) }}>{!(user?.avatar) && (user?.name?.charAt(0) || 'U')}</div>
            </div>
        </div>
      </div>

      <div className="section-label"><Activity size={16} style={{marginRight: '8px'}} /> PERFORMANCE METRICS</div>
      <div className="stats-grid">
        <StatCard label="Calories Burned" value={stats.calories} unit="kcal" color="var(--accent-green)" icon={<Flame size={20} />} trend="+12%" />
        <StatCard label="Active Minutes" value={stats.minutes} unit="min" color="var(--accent-cyan)" icon={<Clock size={20} />} trend="+8%" />
        <StatCard label="Steps Taken" value={stats.steps} unit="steps" color="var(--accent-purple)" icon={<StepsIcon size={20} />} trend="+5%" />
        <StatCard label="Water Intake" value={stats.water.toFixed(2)} unit="Liters" color="var(--accent-orange)" icon={<Droplets size={20} />} trend="-3%" isDown={true} />
      </div>

      <div className="mid-grid">
        <div className="progress-section">
          <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
             <div className="section-title" style={{fontFamily: 'Bebas Neue', fontSize: '20px', letterSpacing: '1px'}}>WEEKLY ACTIVITY INTENSITY</div>
          </div>
          <div className="weekly-bars">
            {weeklyBars.map((b, i) => (
              <div key={i} className="day-col">
                <div className="day-bar-wrap">
                  <div className="day-bar" style={{ height: `${b.height}%` }}></div>
                </div>
                <div className="day-label" style={{fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600'}}>{b.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="progress-section" style={{background: '#0d1117'}}>
          <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '25px'}}>
             <div className="section-title" style={{fontFamily: 'Bebas Neue', fontSize: '20px', letterSpacing: '1px'}}>MONTHLY GOALS STATUS</div>
             <Target size={20} color="var(--text-muted)" />
          </div>
          <GoalItem name="Weight Loss" pct={goals.weightLoss} color="var(--accent-green)" />
          <GoalItem name="Muscle Gain" pct={goals.muscleGain} color="var(--accent-cyan)" />
          <GoalItem name="Endurance" pct={goals.endurance} color="var(--accent-purple)" />
          <GoalItem name="Flexibility" pct={goals.flexibility} color="var(--accent-orange)" />
        </div>
      </div>

      <div className="section-label">RECENT ACTIVITIES</div>
      <div className="workout-grid" style={{marginTop: '20px'}}>
        {workouts.length > 0 ? workouts.map((w, i) => (
           <WorkoutCard key={i} workout={w} />
        )) : (
          <div className="workout-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
             No activities logged yet.
          </div>
        )}
      </div>

      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        <Plus size={32} />
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-tabs" style={{display: 'flex', gap: '20px', marginBottom: '25px', borderBottom: '1px solid var(--border)', paddingBottom: '15px'}}>
                <button 
                    onClick={() => setActiveTab('workout')}
                    style={{background: 'none', border: 'none', color: activeTab === 'workout' ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'Bebas Neue', fontSize: '20px', cursor: 'pointer', letterSpacing: '1px', borderBottom: activeTab === 'workout' ? '2px solid var(--accent-green)' : 'none'}}
                >LOG WORKOUT</button>
                <button 
                    onClick={() => setActiveTab('daily')}
                    style={{background: 'none', border: 'none', color: activeTab === 'daily' ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'Bebas Neue', fontSize: '20px', cursor: 'pointer', letterSpacing: '1px', borderBottom: activeTab === 'daily' ? '2px solid var(--accent-green)' : 'none'}}
                >DAILY STATUS</button>
            </div>

            {activeTab === 'workout' ? (
                <>
                    <div className="form-group">
                    <label className="form-label">Workout Type</label>
                    <select className="form-input" value={newWorkout.type} onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}>
                        <option value="">Select Type</option>
                        <option>Strength Training</option>
                        <option>Cardio</option>
                        <option>HIIT</option>
                        <option>Yoga</option>
                    </select>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <div className="form-group">
                        <label className="form-label">Duration (mins)</label>
                        <input type="number" className="form-input" value={newWorkout.duration} onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})} placeholder="0" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Calories</label>
                        <input type="number" className="form-input" value={newWorkout.calories} onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})} placeholder="0" />
                    </div>
                    </div>
                    <div className="modal-btns">
                    <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="btn-primary" onClick={handleSaveWorkout}>Save Workout</button>
                    </div>
                </>
            ) : (
                <>
                    <div className="form-group">
                        <label className="form-label">Total Steps Today</label>
                        <div style={{position: 'relative'}}>
                            <StepsIcon size={18} style={{position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)'}} />
                            <input 
                                type="number" 
                                className="form-input" 
                                style={{paddingLeft: '45px'}}
                                value={dailyStats.steps} 
                                onChange={(e) => setDailyStats({...dailyStats, steps: e.target.value})} 
                                placeholder="e.g. 10000" 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Water Intake (Glasses)</label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                            <button 
                                onClick={() => setDailyStats({...dailyStats, waterGlasses: Math.max(0, dailyStats.waterGlasses - 1)})}
                                style={{width: '40px', height: '40px', borderRadius: '10px', background: '#1f2937', color: 'white', border: 'none', cursor: 'pointer', fontSize: '20px'}}
                            >-</button>
                            <div style={{flex: 1, textAlign: 'center', background: '#030712', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                                <GlassWater size={20} color="var(--accent-cyan)" />
                                <span style={{fontSize: '20px', fontWeight: 'bold'}}>{dailyStats.waterGlasses}</span>
                                <span style={{color: 'var(--text-muted)', fontSize: '14px'}}>Glasses</span>
                            </div>
                            <button 
                                onClick={() => setDailyStats({...dailyStats, waterGlasses: dailyStats.waterGlasses + 1})}
                                style={{width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-green)', color: 'black', border: 'none', cursor: 'pointer', fontSize: '20px'}}
                            >+</button>
                        </div>
                        <p style={{fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center'}}>
                            Approx. {(dailyStats.waterGlasses * 0.25).toFixed(2)} Liters
                        </p>
                    </div>
                    <div className="modal-btns">
                        <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleUpdateDaily}>Update Day</button>
                    </div>
                </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

const StatCard = ({ label, value, unit, color, icon, trend, isDown }) => (
  <div className="stat-card" style={{ '--accent-color-solid': color }}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <div className="stat-label">{label}</div>
        <div style={{color}}>{icon}</div>
    </div>
    <div className="stat-value">{value.toLocaleString()}</div>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
        <div className="stat-unit">{unit}</div>
        <div style={{fontSize: '12px', fontWeight: '700', color: isDown ? '#f87171' : '#4ade80'}}>
            {trend}
        </div>
    </div>
  </div>
);

const GoalItem = ({ name, pct, color }) => (
  <div className="goal-item">
    <div className="goal-header">
      <span className="goal-name">{name}</span>
      <span className="goal-pct" style={{ color }}>{pct}%</span>
    </div>
    <div className="goal-bar-bg">
      <div className="goal-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }}></div>
    </div>
  </div>
);

const WorkoutCard = ({ workout }) => (
  <div className="workout-card">
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <div className="wc-title" style={{fontFamily: 'Bebas Neue', fontSize: '20px', letterSpacing: '1px'}}>{workout.type.toUpperCase()}</div>
        <div style={{fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600'}}>{new Date(workout.date).toLocaleDateString()}</div>
    </div>
    <div style={{display: 'flex', gap: '20px', marginBottom: '10px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
          <Clock size={14} color="var(--accent-green)" />
          <span style={{fontSize: '13px', fontWeight: '600'}}>{workout.duration} min</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
          <Flame size={14} color="var(--accent-orange)" />
          <span style={{fontSize: '13px', fontWeight: '600'}}>{workout.calories} kcal</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
