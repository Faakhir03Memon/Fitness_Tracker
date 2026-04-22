import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    UserPlus, Mail, Lock, User, RefreshCw, CheckCircle2, ShieldCheck, X,
    Dumbbell, Flame, Activity, Heart, Apple, Timer, Zap, Star, Coffee, 
    Smartphone, Bike, Trophy, Target, Salad, ZapOff, Utensils, Footprints,
    Brain, Droplets, Moon, Sun, Anchor, Award, Camera, Music, Map
} from 'lucide-react';
import API_BASE_URL from '../api/config';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    
    // Captcha States
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [captchaGrid, setCaptchaGrid] = useState([]);
    const [targetCategory, setTargetCategory] = useState('');
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [captchaError, setCaptchaError] = useState('');

    const navigate = useNavigate();

    const ICON_POOL = [
        { name: 'Fitness Gear', icon: <Dumbbell size={28} />, keywords: ['Dumbbell'] },
        { name: 'Energy', icon: <Flame size={28} />, keywords: ['Flame'] },
        { name: 'Workout', icon: <Activity size={28} />, keywords: ['Activity'] },
        { name: 'Health', icon: <Heart size={28} />, keywords: ['Heart'] },
        { name: 'Nutrition', icon: <Apple size={28} />, keywords: ['Apple'] },
        { name: 'Timing', icon: <Timer size={28} />, keywords: ['Timer'] },
        { name: 'Power', icon: <Zap size={28} />, keywords: ['Zap'] },
        { name: 'Achievement', icon: <Star size={28} />, keywords: ['Star'] },
        { name: 'Drink', icon: <Coffee size={28} />, keywords: ['Coffee'] },
        { name: 'Cycling', icon: <Bike size={28} />, keywords: ['Bike'] },
        { name: 'Victory', icon: <Trophy size={28} />, keywords: ['Trophy'] },
        { name: 'Goals', icon: <Target size={28} />, keywords: ['Target'] },
        { name: 'Diet', icon: <Salad size={28} />, keywords: ['Salad'] },
        { name: 'Meal', icon: <Utensils size={28} />, keywords: ['Utensils'] },
        { name: 'Walking', icon: <Footprints size={28} />, keywords: ['Footprints'] },
        { name: 'Mindset', icon: <Brain size={28} />, keywords: ['Brain'] },
        { name: 'Hydration', icon: <Droplets size={28} />, keywords: ['Droplets'] },
        { name: 'Rest', icon: <Moon size={28} />, keywords: ['Moon'] },
        { name: 'Morning', icon: <Sun size={28} />, keywords: ['Sun'] },
        { name: 'Sea Sport', icon: <Anchor size={28} />, keywords: ['Anchor'] },
        { name: 'Medals', icon: <Award size={28} />, keywords: ['Award'] },
        { name: 'Capture', icon: <Camera size={28} />, keywords: ['Camera'] },
        { name: 'Rhythm', icon: <Music size={28} />, keywords: ['Music'] },
        { name: 'Travel', icon: <Map size={28} />, keywords: ['Map'] }
    ];

    const generateCaptcha = () => {
        const target = ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)];
        setTargetCategory(target.name);
        
        let grid = [];
        let targetCount = 0;
        
        for (let i = 0; i < 9; i++) {
            const isTarget = Math.random() > 0.65 || (targetCount < 2 && i > 6);
            if (isTarget) {
                grid.push(target);
                targetCount++;
            } else {
                let other;
                do {
                    other = ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)];
                } while (other.name === target.name);
                grid.push(other);
            }
        }
        setCaptchaGrid(grid);
        setSelectedIndices([]);
        setCaptchaError('');
    };

    const handleVerifyCaptcha = () => {
        const correctIndices = captchaGrid
            .map((item, idx) => item.name === targetCategory ? idx : null)
            .filter(idx => idx !== null);
        
        const isCorrect = correctIndices.length === selectedIndices.length && 
                         selectedIndices.every(idx => correctIndices.includes(idx));

        if (isCorrect) {
            setIsVerified(true);
            setShowCaptcha(false);
        } else {
            setCaptchaError('Verification failed. Try again.');
            generateCaptcha();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isVerified) {
            setError('Please verify that you are not a robot.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password });
            setEmailSent(data.emailSent);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred during signup');
            setIsVerified(false);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ background: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '60px 50px', width: '100%', maxWidth: '480px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>{emailSent ? '📧' : '🎉'}</div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '32px', letterSpacing: '2px', color: '#00ff89', margin: '0 0 15px' }}>
                        {emailSent ? 'CHECK YOUR EMAIL!' : 'ACCOUNT CREATED!'}
                    </h2>
                    <p style={{ color: '#94a3b8', lineHeight: '1.8', marginBottom: '35px' }}>
                        {emailSent ? `We've sent a verification link to ${email}.` : 'Your account is ready! You can now login.'}
                    </p>
                    <Link to="/login" style={{ background: '#00ff89', color: 'black', padding: '14px 40px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '14px', letterSpacing: '1px' }}>
                        GO TO LOGIN
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '50px', width: '100%', maxWidth: '450px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(0,255,137,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(0,255,137,0.2)', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: '-5px', border: '1px dashed rgba(0,255,137,0.2)', borderRadius: '50%', animation: 'spin 10s linear infinite' }}></div>
                        <UserPlus size={32} color="#00ff89" />
                    </div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '2px', color: 'white', margin: '0' }}>JOIN THE ELITE</h2>
                    <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginTop: '5px' }}>Create your account to begin your transformation</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>FULL NAME</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 20px' }}>
                            <User size={18} color="#475569" style={{ marginRight: '15px' }} />
                            <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>EMAIL ADDRESS</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 20px' }}>
                            <Mail size={18} color="#475569" style={{ marginRight: '15px' }} />
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>PASSWORD</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 20px' }}>
                            <Lock size={18} color="#475569" style={{ marginRight: '15px' }} />
                            <input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none' }} />
                        </div>
                    </div>

                    {/* I am not a robot checkbox */}
                    <div style={{ 
                        marginBottom: '25px', padding: '15px 20px', background: '#080c10', 
                        border: '1px solid #1f2937', borderRadius: '12px', display: 'flex', 
                        alignItems: 'center', justifyContent: 'space-between', cursor: isVerified ? 'default' : 'pointer',
                        transition: '0.3s'
                    }} onClick={() => { if(!isVerified) { generateCaptcha(); setShowCaptcha(true); } }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ 
                                width: '24px', height: '24px', border: '2px solid #1f2937', 
                                borderRadius: '4px', background: isVerified ? '#00ff89' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s'
                            }}>
                                {isVerified && <CheckCircle2 size={16} color="black" />}
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: isVerified ? 'white' : '#64748b' }}>
                                I'm not a robot
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <ShieldCheck size={24} color={isVerified ? '#00ff89' : '#1f2937'} />
                            <div style={{ fontSize: '8px', color: '#475569', marginTop: '2px' }}>FIT-CAPTCHA</div>
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '15px', background: 'rgba(239,68,68,0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.1)' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '16px', background: '#00ff89', color: 'black',
                        border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', opacity: isVerified ? 1 : 0.5
                    }}>
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                    Already a member? <Link to="/login" style={{ color: '#00ff89', textDecoration: 'none', fontWeight: '800', marginLeft: '5px' }}>Login Here</Link>
                </div>
            </div>

            {/* Captcha Popup Modal */}
            {showCaptcha && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '24px', width: '100%', maxWidth: '380px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: 'white', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>SELECT ALL ICONS OF:</h3>
                                <h2 style={{ margin: '5px 0 0', color: '#00ff89', fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '1px' }}>{targetCategory.toUpperCase()}</h2>
                            </div>
                            <button onClick={() => setShowCaptcha(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20}/></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {captchaGrid.map((item, idx) => (
                                <div key={idx} onClick={() => {
                                    if (selectedIndices.includes(idx)) setSelectedIndices(selectedIndices.filter(i => i !== idx));
                                    else setSelectedIndices([...selectedIndices, idx]);
                                }} style={{
                                    height: '80px', background: selectedIndices.includes(idx) ? 'rgba(0,255,137,0.1)' : '#080c10',
                                    border: selectedIndices.includes(idx) ? '2px solid #00ff89' : '1px solid #1f2937',
                                    borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: '0.2s', color: selectedIndices.includes(idx) ? '#00ff89' : '#475569'
                                }}>
                                    {item.icon}
                                    {selectedIndices.includes(idx) && (
                                        <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                                            <CheckCircle2 size={12} color="#00ff89" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {captchaError && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '15px', textAlign: 'center', fontWeight: '800' }}>{captchaError}</div>}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                            <RefreshCw size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={generateCaptcha} />
                            <button onClick={handleVerifyCaptcha} style={{ background: '#00ff89', color: 'black', border: 'none', padding: '12px 30px', borderRadius: '10px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                                VERIFY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Signup;
