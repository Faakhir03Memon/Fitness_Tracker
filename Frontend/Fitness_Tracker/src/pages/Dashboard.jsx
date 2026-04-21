import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Flame, Clock, Footprints, Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  }, []);

  const fetchInitialData = async () => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const [statsRes, workoutsRes, weeklyRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/stats/${date}`, authConfig),
        axios.get('http://localhost:5000/api/workouts', authConfig),
        axios.get('http://localhost:5000/api/stats/range/weekly', authConfig)
      ]);

      setStats({
        calories: statsRes.data.caloriesBurned || 847,
        minutes: statsRes.data.activeMinutes || 48,
        steps: statsRes.data.steps || 7342,
        water: statsRes.data.water || 1.8
      });
      setWorkouts(workoutsRes.data.slice(0, 3));
      
      // Map weekly data or use defaults
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const defaultHeights = [80, 60, 90, 45, 70, 55, 100];
      setWeeklyBars(days.map((d, i) => ({ day: d, height: defaultHeights[i] })));

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
          <h1>GOOD MORNING, {user?.name?.split(' ')[0].toUpperCase()}</h1>
          <p>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">
            <div className="streak-dot"></div>
            14-Day Streak
          </div>
          <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
        </div>
      </div>

      <div className="section-label">Today's Stats</div>
      <div className="stats-grid">
        <StatCard label="Calories Burned" value={stats.calories} unit="kcal today" color="var(--accent-green)" icon={<Flame size={20} />} trend="+12%" />
        <StatCard label="Active Minutes" value={stats.minutes} unit="min of 60 goal" color="var(--accent-cyan)" icon={<Clock size={20} />} trend="+8%" />
        <StatCard label="Steps" value={stats.steps} unit="of 10,000 goal" color="var(--accent-purple)" icon={<Footprints size={20} />} trend="+5%" />
        <StatCard label="Water Intake" value={stats.water} unit="L of 3L goal" color="var(--accent-orange)" icon={<Droplets size={20} />} trend="-3%" isDown={true} />
      </div>

      <div className="mid-grid">
        <div className="progress-section">
          <div className="section-header">
            <div className="section-title">WEEKLY WORKOUT INTENSITY</div>
            <div className="section-tag">This Week</div>
          </div>
          <div className="weekly-bars">
            {weeklyBars.map((b, i) => (
              <div key={i} className="day-col">
                <div className="day-bar-wrap">
                  <div className={`day-bar ${i === 0 ? 'today' : ''}`} style={{ height: `${b.height}%` }}></div>
                </div>
                <div className={`day-label ${i === 0 ? 'today' : ''}`}>{b.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="goals-panel">
          <div className="section-header">
            <div className="section-title">GOALS</div>
            <div className="section-tag">Monthly</div>
          </div>
          <GoalItem name="Weight Loss" pct={72} color="var(--accent-green)" />
          <GoalItem name="Muscle Gain" pct={58} color="var(--accent-cyan)" />
          <GoalItem name="Endurance" pct={85} color="var(--accent-purple)" />
        </div>
      </div>

      <div className="section-label">Recent Activities</div>
      <div className="workout-grid">
        {workouts.map((w, i) => (
          <WorkoutCard key={i} workout={w} />
        ))}
      </div>

      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        <Plus />
      </button>

      {isModalOpen && (
        <div className="modal-overlay open">
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
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Duration (mins)</label>
                <input type="number" className="form-input" value={newWorkout.duration} onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Calories</label>
                <input type="number" className="form-input" value={newWorkout.calories} onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})} />
              </div>
            </div>
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveWorkout} style={{ flex: 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const StatCard = ({ label, value, unit, color, icon, trend, isDown }) => (
  <div className="stat-card" style={{ '--accent-color-solid': color }}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value.toLocaleString()}</div>
    <div className="stat-unit">{unit}</div>
    <div className={`stat-trend ${isDown ? 'down' : ''}`}>{trend}</div>
  </div>
);

const GoalItem = ({ name, pct, color }) => (
  <div className="goal-item" style={{ marginBottom: '22px' }}>
    <div className="goal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span className="goal-name" style={{ fontSize: '13px', fontWeight: '600' }}>{name}</span>
      <span className="goal-pct" style={{ color, fontFamily: 'Bebas Neue', fontSize: '18px' }}>{pct}%</span>
    </div>
    <div className="goal-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
      <div className="goal-fill" style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: '10px' }}></div>
    </div>
  </div>
);

const WorkoutCard = ({ workout }) => (
  <div className="workout-card">
    <div className="wc-title">{workout.type}</div>
    <div className="wc-meta">{new Date(workout.date).toLocaleDateString()}</div>
    <div className="wc-stats">
      <div className="wc-stat"><div className="n">{workout.duration}</div><div className="u">Mins</div></div>
      <div className="wc-stat"><div className="n">{workout.calories}</div><div className="u">Kcal</div></div>
    </div>
  </div>
);

export default Dashboard;
