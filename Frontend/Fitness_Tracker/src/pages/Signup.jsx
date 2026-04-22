import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Dumbbell, Flame, Activity, Heart, Apple, Timer, Zap, Star, Coffee, Smartphone, RefreshCw } from 'lucide-react';
import API_BASE_URL from '../api/config';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaGrid, setCaptchaGrid] = useState([]);
    const [targetIconName, setTargetIconName] = useState('');
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const ICON_POOL = [
        { name: 'Dumbbell', icon: <Dumbbell size={24} /> },
        { name: 'Flame', icon: <Flame size={24} /> },
        { name: 'Activity', icon: <Activity size={24} /> },
        { name: 'Heart', icon: <Heart size={24} /> },
        { name: 'Apple', icon: <Apple size={24} /> },
        { name: 'Timer', icon: <Timer size={24} /> },
        { name: 'Zap', icon: <Zap size={24} /> },
        { name: 'Star', icon: <Star size={24} /> },
        { name: 'Coffee', icon: <Coffee size={24} /> },
        { name: 'Smartphone', icon: <Smartphone size={24} /> },
    ];

    const generateCaptcha = () => {
        const target = ICON_POOL[Math.floor(Math.random() * 3)]; // Target is one of the first 3 (Fitness related)
        setTargetIconName(target.name);
        
        let grid = [];
        let targetCount = 0;
        
        for (let i = 0; i < 9; i++) {
            const isTarget = Math.random() > 0.7;
            if (isTarget) {
                grid.push(target);
                targetCount++;
            } else {
                let randomIcon;
                do {
                    randomIcon = ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)];
                } while (randomIcon.name === target.name);
                grid.push(randomIcon);
            }
        }
        
        if (targetCount === 0) {
            grid[Math.floor(Math.random() * 9)] = target;
        }
        
        setCaptchaGrid(grid);
        setSelectedIndices([]);
    };

    React.useEffect(() => {
        generateCaptcha();
    }, []);

    const toggleIcon = (index) => {
        if (selectedIndices.includes(index)) {
            setSelectedIndices(selectedIndices.filter(i => i !== index));
        } else {
            setSelectedIndices([...selectedIndices, index]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const correctIndices = captchaGrid
            .map((item, idx) => item.name === targetIconName ? idx : null)
            .filter(idx => idx !== null);
        
        const isCorrect = correctIndices.length === selectedIndices.length && 
                         selectedIndices.every(idx => correctIndices.includes(idx));

        if (!isCorrect) {
            setError(`Security Check Failed: Please select ALL ${targetIconName} icons.`);
            generateCaptcha();
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password });
            setEmailSent(data.emailSent);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred during signup');
            generateCaptcha();
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
                    {emailSent ? (
                        <>
                            <p style={{ color: '#94a3b8', lineHeight: '1.8', marginBottom: '10px' }}>
                                We've sent a <strong style={{ color: 'white' }}>verification link</strong> to:
                            </p>
                            <p style={{ color: '#00ff89', fontWeight: '800', fontSize: '16px', marginBottom: '25px' }}>{email}</p>
                            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '35px' }}>
                                Click the link in that email to activate your account. Check your spam folder if you don't see it.
                            </p>
                        </>
                    ) : (
                        <>
                            <p style={{ color: '#94a3b8', lineHeight: '1.8', marginBottom: '35px' }}>
                                Your account is ready! You can now login with your credentials.
                            </p>
                        </>
                    )}
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

                    <div style={{ marginBottom: '25px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#00ff89', letterSpacing: '1px' }}>
                                SELECT ALL <span style={{ color: 'white', background: 'rgba(0,255,137,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{targetIconName.toUpperCase()}</span> ICONS
                            </label>
                            <RefreshCw size={14} color="#64748b" style={{ cursor: 'pointer' }} onClick={generateCaptcha} />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {captchaGrid.map((item, idx) => (
                                <div key={idx} onClick={() => toggleIcon(idx)} style={{
                                    height: '60px', background: selectedIndices.includes(idx) ? 'rgba(0,255,137,0.1)' : '#080c10',
                                    border: selectedIndices.includes(idx) ? '2px solid #00ff89' : '1px solid #1f2937',
                                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: '0.2s', color: selectedIndices.includes(idx) ? '#00ff89' : '#475569'
                                }}>
                                    {item.icon}
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: '10px', color: '#475569', marginTop: '12px', textAlign: 'center' }}>Verification required to prevent bots</p>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '15px', background: 'rgba(239,68,68,0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.1)' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '16px', background: '#00ff89', color: 'black',
                        border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', marginTop: '5px'
                    }}>
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                    Already a member? <Link to="/login" style={{ color: '#00ff89', textDecoration: 'none', fontWeight: '800', marginLeft: '5px' }}>Login Here</Link>
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Signup;
