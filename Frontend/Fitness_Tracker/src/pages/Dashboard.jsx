import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Flame, Clock, Footprints, Droplets, Target, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    calories: 0,
    minutes: 0,
    steps: 0,
    water: 0
  });

  const [workouts, setWorkouts] = useState([]);
  const [weeklyBars, setWeeklyBars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ type: '', duration: '', calories: '', notes: '' });

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
        axios.get(`http://localhost:5000/api/stats/${date}`, authConfig),
        axios.get('http://localhost:5000/api/workouts', authConfig),
        axios.get('http://localhost:5000/api/stats/range/weekly', authConfig)
      ]);

      setStats({
        calories: statsRes.data.caloriesBurned || 0,
        minutes: statsRes.data.activeMinutes || 0,
        steps: statsRes.data.steps || 0,
        water: statsRes.data.water || 0
      });
      setWorkouts(workoutsRes.data.slice(0, 3));
      
      const chartData = weeklyRes.data.length > 0 ? weeklyRes.data.map(item => ({
        day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        height: Math.min(((item.caloriesBurned || 0) / 3000) * 100, 100) || Math.floor(Math.random() * 40) + 30
      })) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ day: d, height: 30 }));

      setWeeklyBars(chartData);

    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  const handleSaveWorkout = async () => {
    try {
      await axios.post('http://localhost:5000/api/workouts', newWorkout, authConfig);
      setIsModalOpen(false);
      setNewWorkout({ type: '', duration: '', calories: '', notes: '' });
      fetchInitialData();
    } catch (err) {
      console.error("Error saving workout", err);
    }
  };

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>WELCOME, {user?.name?.split(' ')[0].toUpperCase()}</h1>
          <p>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">
             <div className="streak-dot"></div>
             Active Session
          </div>
          <div className="avatar" style={{ marginLeft: '10px' }}>{user?.name?.charAt(0) || 'U'}</div>
        </div>
      </div>

      <div className="section-label"><Activity size={16} style={{marginRight: '8px'}} /> PERFORMANCE METRICS</div>
      <div className="stats-grid">
        <StatCard label="Calories Burned" value={stats.calories} unit="kcal" color="var(--accent-green)" icon={<Flame size={20} />} trend="+12%" />
        <StatCard label="Active Minutes" value={stats.minutes} unit="min" color="var(--accent-cyan)" icon={<Clock size={20} />} trend="+8%" />
        <StatCard label="Steps Taken" value={stats.steps} unit="steps" color="var(--accent-purple)" icon={<Footprints size={20} />} trend="+5%" />
        <StatCard label="Water Intake" value={stats.water} unit="Liters" color="var(--accent-orange)" icon={<Droplets size={20} />} trend="-3%" isDown={true} />
      </div>

      <div className="mid-grid">
        <div className="progress-section">
          <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
             <div className="section-title" style={{fontFamily: 'Bebas Neue', fontSize: '20px', letterSpacing: '1px'}}>WEEKLY ACTIVITY INTENSITY</div>
             <div className="section-tag" style={{fontSize: '12px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px'}}>Performance</div>
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
          <GoalItem name="Weight Loss" pct={72} color="var(--accent-green)" />
          <GoalItem name="Muscle Gain" pct={58} color="var(--accent-cyan)" />
          <GoalItem name="Endurance" pct={85} color="var(--accent-purple)" />
          <GoalItem name="Flexibility" pct={40} color="var(--accent-orange)" />
        </div>
      </div>

      <div className="section-label">RECENT ACTIVITIES</div>
      <div className="workout-grid" style={{marginTop: '20px'}}>
        {workouts.length > 0 ? workouts.map((w, i) => (
           <WorkoutCard key={i} workout={w} />
        )) : (
          <div className="workout-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
             No activities logged yet starts by clicking the + button.
          </div>
        )}
      </div>

      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        <Plus size={32} />
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Log Workout</h2>
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
        <div className="wc-title" style={{fontFamily: 'Bebas Neue', fontSize: '20px', letterSpacing: '1px'}}>{workout.type}</div>
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
