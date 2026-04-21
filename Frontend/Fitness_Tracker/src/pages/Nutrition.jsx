import React, { useState } from 'react';
import { Droplets, Salad, Zap, Heart, Plus, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Nutrition = () => {
    const { user } = useAuth();
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
                    <h1 style={{fontFamily: 'Bebas Neue', fontSize: '48px', letterSpacing: '3px'}}>FUEL & HYDRATION</h1>
                    <p>Track your nutrition for peak performance</p>
                </div>
                <div className="streak-badge">
                   <Droplets size={16} /> {water}L Water Today
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card" style={{ '--accent-color-solid': 'var(--accent-cyan)' }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                        <div className="stat-label">DAILY HYDRATION</div>
                        <Droplets size={20} color="var(--accent-cyan)" />
                    </div>
                    <div className="stat-value">{water}<span className="stat-unit">Liters</span></div>
                    <div className="goal-bar-bg" style={{marginTop: '15px', height: '6px'}}>
                        <div className="goal-bar-fill" style={{ width: `${(water/3)*100}%`, background: 'var(--accent-cyan)' }}></div>
                    </div>
                    <button className="btn-primary" onClick={addWater} style={{ marginTop: '20px', width: '100%', background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                        <Plus size={16} style={{marginRight: '8px'}} /> Add 250ml
                    </button>
                </div>

                {macros.slice(0, 3).map((m, i) => (
                    <div key={i} className="stat-card" style={{ '--accent-color-solid': m.color }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                             <div className="stat-label">{m.name.toUpperCase()}</div>
                             <Scale size={18} color={m.color} />
                        </div>
                        <div className="stat-value">{m.val}<span className="stat-unit">{m.unit}</span></div>
                        <div className="stat-unit" style={{marginTop: '5px'}}>Goal: {m.goal}g</div>
                        <div className="goal-bar-bg" style={{marginTop: '15px', height: '6px'}}>
                            <div className="goal-bar-fill" style={{ width: `${(m.val/m.goal)*100}%`, background: m.color }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="section-label">MEAL HISTORY</div>
            <div className="workout-grid">
                <MealCard title="Avocado Toast & Eggs" meta="Breakfast | 8:30 AM" cals="420" icon={<Salad size={22} />} color="var(--accent-green)" />
                <MealCard title="Chicken Quinoa Bowl" meta="Lunch | 1:15 PM" cals="650" icon={<Zap size={22} />} color="var(--accent-purple)" />
                <MealCard title="Protein Shake" meta="Snack | 4:45 PM" cals="180" icon={<Heart size={22} />} color="var(--accent-cyan)" />
            </div>

            <style>{`
                .meal-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 24px;
                    padding: 25px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    transition: 0.3s;
                }
                .meal-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.1); }
                .meal-icon-wrap {
                    width: 56px; height: 56px; border-radius: 16px;
                    display: flex; align-items: center; justify-content: center;
                }
                .meal-info { flex: 1; }
                .meal-title { font-family: 'Bebas Neue'; fontSize: '20px'; letter-spacing: '1px'; margin-bottom: 2px; }
                .meal-meta { font-size: 12px; color: var(--text-muted); font-weight: 600; }
                .meal-cals { text-align: right; }
                .meal-cals-val { font-family: 'Bebas Neue'; font-size: 24px; color: var(--accent-green); line-height: 1; }
                .meal-cals-u { font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
            `}</style>
        </main>
    );
};

const MealCard = ({ title, meta, cals, icon, color }) => (
    <div className="meal-card">
        <div className="meal-icon-wrap" style={{ background: `${color}15`, color: color }}>
            {icon}
        </div>
        <div className="meal-info">
            <div className="meal-title">{title.toUpperCase()}</div>
            <div className="meal-meta">{meta}</div>
        </div>
        <div className="meal-cals">
            <div className="meal-cals-val">{cals}</div>
            <div className="meal-cals-u">Calories</div>
        </div>
    </div>
);

export default Nutrition;
