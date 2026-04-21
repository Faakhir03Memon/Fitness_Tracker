import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Flame, Clock, Footprints, Droplets } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    calories: 847,
    minutes: 48,
    steps: 7342,
    water: 1.8
  });

  const [workouts, setWorkouts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ type: '', duration: '', calories: '', notes: '' });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/workouts');
      setWorkouts(res.data);
    } catch (err) {
      console.error("Error fetching workouts", err);
    }
  };

  const handleSaveWorkout = async () => {
    try {
      await axios.post('http://localhost:5000/api/workouts', newWorkout);
      setIsModalOpen(false);
      setNewWorkout({ type: '', duration: '', calories: '', notes: '' });
      fetchWorkouts();
    } catch (err) {
      console.error("Error saving workout", err);
    }
  };

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>GOOD MORNING, ALI</h1>
          <p>Monday, 21 April 2026 &nbsp;|&nbsp; Week 4 of your 12-week plan</p>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">
            <div className="streak-dot"></div>
            14-Day Streak
          </div>
          <div className="avatar">AL</div>
        </div>
      </div>

      <div className="section-label">Today's Stats</div>
      <div className="stats-grid">
        <StatCard label="Calories Burned" value={stats.calories} unit="kcal today" color="var(--accent-green)" icon={<Flame size={20} />} trend="+12%" />
        <StatCard label="Active Minutes" value={stats.minutes} unit="min of 60 goal" color="var(--accent-cyan)" icon={<Clock size={20} />} trend="+8%" />
        <StatCard label="Steps" value={stats.steps} unit="of 10,000 goal" color="var(--accent-purple)" icon={<Footprints size={20} />} trend="+5%" />
        <StatCard label="Water Intake" value={stats.water} unit="L of 3L goal" color="var(--accent-orange)" icon={<Droplets size={20} />} trend="-3%" isDown={true} />
      </div>

      <div className="section-label">Recent Workouts</div>
      <div className="workout-grid">
        {workouts.map((w, i) => (
          <WorkoutCard key={i} workout={w} />
        ))}
        {workouts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No workouts logged yet.</p>}
      </div>

      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        <Plus />
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

const StatCard = ({ label, value, unit, color, trend, isDown }) => (
  <div className="stat-card" style={{ '--accent-color-solid': color }}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value.toLocaleString()}</div>
    <div className="stat-unit">{unit}</div>
    <div className={`stat-trend ${isDown ? 'down' : ''}`}>{trend}</div>
  </div>
);

const WorkoutCard = ({ workout }) => (
  <div className="workout-card">
    <div className="wc-title" style={{ fontFamily: 'Bebas Neue', fontSize: '20px', letterSpacing: '1.5px', marginBottom: '4px' }}>{workout.type}</div>
    <div className="wc-meta" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
      {new Date(workout.date).toLocaleDateString()} &nbsp;|&nbsp; {new Date(workout.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
    <div className="wc-stats" style={{ display: 'flex', gap: '16px' }}>
      <div className="wc-stat">
        <div className="n" style={{ fontFamily: 'Bebas Neue', fontSize: '24px', color: 'var(--accent-green)' }}>{workout.duration}</div>
        <div className="u" style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mins</div>
      </div>
      <div className="wc-stat">
        <div className="n" style={{ fontFamily: 'Bebas Neue', fontSize: '24px', color: 'var(--accent-green)' }}>{workout.calories}</div>
        <div className="u" style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Kcal</div>
      </div>
    </div>
  </div>
);

export default Dashboard;
