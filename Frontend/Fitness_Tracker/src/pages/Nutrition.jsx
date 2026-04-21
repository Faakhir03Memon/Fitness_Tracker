import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Salad, Zap, Heart, Plus, Search, Utensils, Brain, Flame, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Pakistani Food Database with Nutritional Values
const ASIAN_FOOD_DATABASE = [
    { name: 'Omelette (2 eggs)', cal: 180, pro: 12, carb: 2, fat: 14, category: 'Breakfast' },
    { name: 'Paratha (Whole Wheat)', cal: 260, pro: 5, carb: 35, fat: 12, category: 'Breakfast' },
    { name: 'Anda Paratha', cal: 440, pro: 17, carb: 37, fat: 26, category: 'Breakfast' },
    { name: 'Apple', cal: 95, pro: 0.5, carb: 25, fat: 0.3, category: 'Snack' },
    { name: 'Chicken Karahi (250g)', cal: 450, pro: 35, carb: 8, fat: 30, category: 'Lunch/Dinner' },
    { name: 'Roti (Plain)', cal: 120, pro: 4, carb: 24, fat: 0.5, category: 'Lunch/Dinner' },
    { name: 'Dal Chawal (Medium Bowl)', cal: 350, pro: 12, carb: 65, fat: 4, category: 'Lunch/Dinner' },
    { name: 'Beef Biryani (Plate)', cal: 550, pro: 25, carb: 75, fat: 18, category: 'Lunch/Dinner' },
    { name: 'Grilled Chicken Tikka', cal: 220, pro: 38, carb: 2, fat: 6, category: 'Lunch/Dinner' },
    { name: 'Lentil Soup (Dal)', cal: 180, pro: 10, carb: 28, fat: 2, category: 'Lunch/Dinner' },
    { name: 'Mixed Salad', cal: 50, pro: 2, carb: 8, fat: 0, category: 'Side' },
    { name: 'Greek Yogurt (Cup)', cal: 150, pro: 15, carb: 6, fat: 8, category: 'Snack' },
    { name: 'Haleem (Bowl)', cal: 420, pro: 28, carb: 45, fat: 12, category: 'Lunch/Dinner' },
];

const Nutrition = () => {
    const { user } = useAuth();
    const [meals, setMeals] = useState([]);
    const [stats, setStats] = useState({ pro: 0, carb: 0, fat: 0, cal: 0 });
    const [search, setSearch] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [recommendation, setRecommendation] = useState(null);

    // Dynamic Goals based on user (simulated)
    const goals = { pro: 160, carb: 220, fat: 70, cal: 2400 };

    const authConfig = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        try {
            const [mealsRes, statsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/meals/${today}`, authConfig),
                axios.get(`http://localhost:5000/api/stats/${today}`, authConfig)
            ]);
            setMeals(mealsRes.data);
            setStats({
                pro: statsRes.data.totalProtein || 0,
                carb: statsRes.data.totalCarbs || 0,
                fat: statsRes.data.totalFats || 0,
                cal: statsRes.data.totalCaloriesIn || 0
            });
            generateAIRecommendation(statsRes.data);
        } catch (err) {
            console.error("Fetch error", err);
        }
    };

    const handleLogMeal = async (food) => {
        try {
            await axios.post('http://localhost:5000/api/meals', {
                ...food,
                foodName: food.name,
                calories: food.cal,
                protein: food.pro,
                carbs: food.carb,
                fats: food.fat,
                mealType: 'Meal',
                date: today
            }, authConfig);
            setIsAdding(false);
            setSearch('');
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const generateAIRecommendation = (currentStats) => {
        const remainingPro = goals.pro - (currentStats.totalProtein || 0);
        const remainingCarb = goals.carb - (currentStats.totalCarbs || 0);
        
        let target;
        if (remainingPro > 30) {
            target = ASIAN_FOOD_DATABASE.find(f => f.pro > 20 && f.carb < 30);
        } else if (remainingCarb > 50) {
            target = ASIAN_FOOD_DATABASE.find(f => f.carb > 40);
        } else {
            target = ASIAN_FOOD_DATABASE.find(f => f.cal < 250);
        }
        setRecommendation(target);
    };

    const filteredFood = ASIAN_FOOD_DATABASE.filter(f => 
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    const getRemaining = (type) => Math.max(0, goals[type] - stats[type]);

    return (
        <main className="main nutrition-page">
            <div className="topbar">
                <div className="greeting">
                    <h1 style={{fontFamily: 'Bebas Neue', fontSize: '48px', letterSpacing: '3px'}}>DIET PLANNER & TRACKER</h1>
                    <p>AI-Optimized nutritional tracking for your body type</p>
                </div>
            </div>

            <div className="diet-grid">
                {/* MACRO PROGRESS */}
                <div className="macro-panel">
                    <div className="section-label">DAILY MACRONUTRIENTS</div>
                    <div className="macro-cards">
                        <MacroCard label="PROTEIN" val={stats.pro} goal={goals.pro} unit="g" color="var(--accent-green)" />
                        <MacroCard label="CARBS" val={stats.carb} goal={goals.carb} unit="g" color="var(--accent-cyan)" />
                        <MacroCard label="FATS" val={stats.fat} goal={goals.fat} unit="g" color="var(--accent-purple)" />
                        <MacroCard label="TOTAL CALS" val={stats.cal} goal={goals.cal} unit="kcal" color="var(--accent-orange)" />
                    </div>
                </div>

                {/* AI ADVISOR */}
                <div className="ai-advisor-panel">
                    <div className="advisor-header">
                        <Brain size={24} color="var(--accent-green)" />
                        <div className="advisor-title">AI DIET ADVISOR</div>
                    </div>
                    {recommendation ? (
                        <div className="recommendation-content">
                            <p className="advisor-msg">Based on your remaining <strong>{getRemaining('pro')}g Protein</strong> and <strong>{getRemaining('carb')}g Carbs</strong>, I recommend:</p>
                            <div className="rec-card">
                                <div className="rec-food">{recommendation.name}</div>
                                <div className="rec-stats">
                                    <span>P: {recommendation.pro}g</span>
                                    <span>C: {recommendation.carb}g</span>
                                    <span>F: {recommendation.fat}g</span>
                                </div>
                            </div>
                            <p style={{fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px'}}>* Recommendation based on Halal Pakistani dietary staples.</p>
                        </div>
                    ) : <p>Analyzing your intake...</p>}
                </div>
            </div>

            <div className="diet-log-section">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <div className="section-label">TODAY'S MEAL HISTORY</div>
                    <button className={isAdding ? "btn-cancel" : "btn-primary"} onClick={() => setIsAdding(!isAdding)} style={{width: 'auto', padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {isAdding ? 'CLOSE SEARCH' : <><Plus size={18} /> LOG FOOD</>}
                    </button>
                </div>

                {isAdding && (
                    <div className="food-search-box animate-fade-in" style={{marginBottom: '30px'}}>
                        <div className="search-input-wrap">
                            <Search size={20} />
                            <input 
                                type="text" 
                                placeholder="Search Pakistani foods (Biryani, Karahi, Omelette...)" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="food-results grid">
                            {filteredFood.slice(0, 6).map((food, i) => (
                                <div key={i} className="food-result-item" onClick={() => handleLogMeal(food)}>
                                    <div className="fr-info">
                                        <div className="fr-name">{food.name}</div>
                                        <div className="fr-macros">P: {food.pro}g | C: {food.carb}g | F: {food.fat}g</div>
                                    </div>
                                    <div className="fr-cal">{food.cal}<span>kcal</span></div>
                                    <Plus size={18} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="meal-table-wrap">
                    {meals.length > 0 ? (
                        <div className="workout-grid">
                            {meals.map((m, i) => (
                                <div key={i} className="meal-log-card">
                                    <Utensils size={20} color="var(--accent-green)" />
                                    <div className="ml-info">
                                        <div className="ml-name">{m.foodName}</div>
                                        <div className="ml-meta">P:{m.protein}g C:{m.carbs}g F:{m.fats}g</div>
                                    </div>
                                    <div className="ml-cal">{m.calories} <span>KCAL</span></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-diet">
                            <Utensils size={40} style={{opacity: 0.2, marginBottom: '15px'}} />
                            <p>You haven't logged any food today. Optimize your gains by tracking your macros!</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .diet-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 40px; }
                
                .macro-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                .macro-card { background: var(--bg-card); border: 1px solid var(--border); padding: 25px; border-radius: 20px; }
                .mc-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                .mc-label { font-size: 11px; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; }
                .mc-val { font-family: 'Bebas Neue'; font-size: 32px; color: white; }
                .mc-goal { font-size: 12px; color: var(--text-muted); margin-top: 5px; }
                
                .ai-advisor-panel { background: linear-gradient(135deg, #0d1117 0%, #1e293b 100%); border: 1px solid var(--accent-green); border-radius: 24px; padding: 30px; position: relative; overflow: hidden; }
                .advisor-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .advisor-title { font-family: 'Bebas Neue'; font-size: 20px; color: var(--accent-green); letter-spacing: 1px; }
                .advisor-msg { font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 15px; }
                
                .rec-card { background: rgba(0, 255, 135, 0.05); border: 1px dashed var(--accent-green); padding: 15px; border-radius: 12px; }
                .rec-food { font-weight: 700; color: white; font-size: 16px; margin-bottom: 5px; }
                .rec-stats { font-size: 12px; color: var(--accent-green); font-weight: 600; display: flex; gap: 12px; }

                .search-input-wrap { display: flex; align-items: center; gap: 15px; background: #080c10; border: 1px solid var(--border); padding: 15px 25px; border-radius: 18px; margin-bottom: 20px; }
                .search-input-wrap input { background: none; border: none; color: white; width: 100%; outline: none; font-size: 16px; }
                
                .food-result-item { display: flex; align-items: center; gap: 20px; background: var(--bg-card); padding: 15px 25px; border-radius: 15px; border: 1px solid var(--border); cursor: pointer; transition: 0.3s; margin-bottom: 10px; }
                .food-result-item:hover { transform: translateX(10px); border-color: var(--accent-green); }
                .fr-info { flex: 1; }
                .fr-name { font-weight: 700; }
                .fr-macros { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
                .fr-cal { font-family: 'Bebas Neue'; font-size: 20px; color: var(--accent-green); }
                .fr-cal span { font-size: 10px; margin-left: 4px; color: var(--text-muted); }

                .meal-log-card { background: var(--bg-card); border: 1px solid var(--border); padding: 20px; border-radius: 18px; display: flex; align-items: center; gap: 20px; }
                .ml-info { flex: 1; }
                .ml-name { font-weight: 700; font-size: 15px; }
                .ml-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
                .ml-cal { text-align: right; font-family: 'Bebas Neue'; font-size: 20px; color: var(--accent-green); }
                .ml-cal span { font-size: 10px; color: var(--text-muted); }
                
                .empty-diet { text-align: center; padding: 60px; color: var(--text-muted); border: 2px dashed var(--border); border-radius: 24px; }
                
                .animate-fade-in { animation: fadeIn 0.4s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </main>
    );
};

const MacroCard = ({ label, val, goal, unit, color }) => (
    <div className="macro-card">
        <div className="mc-head">
            <div className="mc-label">{label}</div>
            <div style={{color}}><Info size={14}/></div>
        </div>
        <div className="mc-val">{val}<span style={{fontSize: '14px', color: 'var(--text-muted)', marginLeft: '5px'}}>{unit}</span></div>
        <div className="mc-goal">Target: {goal}{unit}</div>
        <div className="goal-bar-bg" style={{height: '6px', marginTop: '15px'}}>
            <div className="goal-bar-fill" style={{width: `${Math.min(100, (val/goal)*100)}%`, background: color}}></div>
        </div>
    </div>
);

export default Nutrition;
