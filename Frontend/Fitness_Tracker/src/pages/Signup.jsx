import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Activity } from 'lucide-react';
import API_BASE_URL from '../api/config';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const canvasRef = React.useRef(null);
    const navigate = useNavigate();

    const generateCaptcha = () => {
        const charSet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; 
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }
        setCaptcha(result);
        drawCaptcha(result);
    };

    const drawCaptcha = (text) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Noise lines
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(0, 255, 137, ${Math.random() * 0.3})`;
            ctx.lineWidth = Math.random() * 2;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        // Noise dots
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(0, 255, 137, ${Math.random() * 0.2})`;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Captcha Text
        ctx.font = 'bold 28px "Courier New"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < text.length; i++) {
            const x = 30 + i * 25;
            const y = canvas.height / 2 + (Math.random() * 10 - 5);
            const angle = (Math.random() * 20 - 10) * Math.PI / 180;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = i % 2 === 0 ? '#00ff89' : '#00d4ff';
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }
    };

    React.useEffect(() => {
        setTimeout(generateCaptcha, 100); // Small delay to ensure canvas is ready
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (captchaInput.toUpperCase() !== captcha) {
            setError('Invalid security code. Please try again.');
            generateCaptcha();
            setCaptchaInput('');
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

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>IMAGE SECURITY CODE</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ 
                                position: 'relative', overflow: 'hidden', borderRadius: '12px', 
                                border: '1px solid #1e293b', background: '#0f172a', cursor: 'pointer' 
                            }} onClick={generateCaptcha} title="Click to refresh">
                                <canvas ref={canvasRef} width="180" height="48" style={{ display: 'block' }}></canvas>
                                <div style={{ position: 'absolute', top: '5px', right: '5px', color: 'rgba(255,255,255,0.2)' }}>
                                    <Activity size={12} />
                                </div>
                            </div>
                            <input type="text" placeholder="Enter Code" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} required
                                style={{ 
                                    flex: 1, background: '#080c10', border: '1px solid #1f2937', 
                                    borderRadius: '12px', padding: '14px', color: 'white', outline: 'none', 
                                    textAlign: 'center', fontWeight: '800', letterSpacing: '2px', fontSize: '14px'
                                }} />
                        </div>
                        <p style={{ fontSize: '10px', color: '#475569', marginTop: '8px', textAlign: 'center' }}>Can't read? Click the image to refresh</p>
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
