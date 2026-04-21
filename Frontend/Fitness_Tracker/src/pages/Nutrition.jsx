import React, { useState } from 'react';
import { Droplets, Salad, Zap, Heart } from 'lucide-react';

const Nutrition = () => {
  const [water, setWater] = useState(1.8);
  const macros = [
    { name: 'Protein', val: 145, goal: 180, color: 'var(--accent-orange)', unit: 'g' },
    { name: 'Carbs', val: 210, goal: 250, color: 'var(--accent-green)', unit: 'g' },
    { name: 'Fats', val: 55, goal: 70, color: 'var(--accent-cyan)', unit: 'g' },
    { name: 'Calories', val: 1850, goal: 2400, color: 'var(--accent-purple)', unit: 'kcal' }
  ];

  const addWater = () => {
    if (water < 4) setWater(prev => parseFloat((prev + 0.25).toFixed(2)));
  };

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>Fuel & Hydration</h1>
          <p>Monitor your intake to optimize recovery</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ '--accent-color-solid': 'var(--accent-orange)' }}>
          <div className="stat-label">Hydration Level</div>
          <div className="stat-value">{water}L</div>
          <div className="stat-unit">Daily Goal: 3.0L</div>
          <button className="btn-primary" onClick={addWater} style={{ marginTop: '16px', padding: '8px 16px' }}>+ Add 250ml</button>
        </div>

        {macros.map((m, i) => (
          <div key={i} className="stat-card" style={{ '--accent-color-solid': m.color }}>
            <div className="stat-label">{m.name} Intake</div>
            <div className="stat-value">{m.val}{m.unit}</div>
            <div className="stat-unit">Goal: {m.goal}{m.unit}</div>
            <div className="goal-bar" style={{ marginTop: '16px' }}>
              <div className="goal-fill" style={{ width: `${(m.val/m.goal)*100}%`, background: m.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-label">Meal History</div>
      <div className="workout-grid">
        <MealCard title="Avocado Toast & Eggs" meta="Breakfast | 8:30 AM" cals="420" icon={<Salad size={20} color="var(--accent-green)"/>} />
        <MealCard title="Chicken Quinoa Bowl" meta="Lunch | 1:15 PM" cals="650" icon={<Zap size={20} color="var(--accent-purple)"/>} />
        <MealCard title="Protein Shake" meta="Snack | 4:45 PM" cals="180" icon={<Heart size={20} color="var(--accent-cyan)"/>} />
      </div>
    </main>
  );
};

const MealCard = ({ title, meta, cals, icon }) => (
  <div className="workout-card">
    <div className="wc-icon" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>{icon}</div>
    <div className="wc-title">{title}</div>
    <div className="wc-meta">{meta}</div>
    <div className="wc-stats">
      <div className="wc-stat">
        <div className="n" style={{ color: 'var(--accent-green)' }}>{cals}</div>
        <div className="u">Calories</div>
      </div>
    </div>
  </div>
);

export default Nutrition;
