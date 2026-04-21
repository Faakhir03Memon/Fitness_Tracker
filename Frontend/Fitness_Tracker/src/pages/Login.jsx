import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(data);
            if (data.role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container premium-dark">
            <div className="auth-card glassmorphism animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                         <div className="logo-ring"></div>
                         <ShieldCheck size={32} color="var(--accent-green)" />
                    </div>
                    <h2 className="bebas-font">ELITE ACCESS</h2>
                    <p className="auth-subtitle">Login to your specialized fitness environment</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>EMAIL ADDRESS</label>
                        <div className="input-field">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>PASSWORD</label>
                        <div className="input-field">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'VERIFYING...' : 'LOGIN TO ACCOUNT'}
                    </button>
                    
                    <div className="divider"><span>OR CONTINUE WITH EMAIL</span></div>
                </form>

                <div className="auth-footer">
                    New to FitTrack? <Link to="/signup" className="glow-link">Create Account</Link>
                </div>
            </div>

            <style>{`
                .premium-dark { background: #030712; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .auth-card { background: rgba(13, 17, 23, 0.82); border: 1px solid rgba(255,255,255,0.06); border-radius: 32px; padding: 50px; width: 100%; max-width: 440px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
                .bebas-font { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: 2px; color: white; margin: 0; }
                .auth-subtitle { color: #64748b; font-size: 13px; font-weight: 600; margin-top: 5px; }
                .auth-header { text-align: center; margin-bottom: 35px; }
                .auth-logo { width: 75px; height: 75px; border-radius: 50%; background: rgba(0, 255, 137, 0.05); display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(0, 255, 137, 0.2); position: relative; }
                .logo-ring { position: absolute; inset: -5px; border: 1px dashed rgba(0, 255, 137, 0.3); border-radius: 50%; animation: spin 12s linear infinite; }
                @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
                
                .input-group { margin-bottom: 20px; }
                .input-group label { display: block; font-size: 11px; font-weight: 800; color: #475569; letter-spacing: 1.2px; margin-bottom: 10px; }
                .input-field { display: flex; align-items: center; background: #080c10; border: 1px solid #1e293b; border-radius: 12px; padding: 0 18px; outline: 1px solid transparent; transition: 0.3s; }
                .input-field svg { color: #334155; margin-right: 12px; }
                .input-field input { background: none; border: none; padding: 14px 0; color: white; flex: 1; outline: none; font-size: 14px; }
                .input-field:focus-within { border-color: var(--accent-green); box-shadow: 0 0 0 4px rgba(0,255,137,0.05); }
                
                .login-btn { width: 100%; padding: 16px; background: var(--accent-green); color: black; border: none; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; margin-top: 5px; }
                .login-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0, 255, 137, 0.2); }
                
                .divider { text-align: center; margin: 30px 0; border-top: 1px solid rgba(255,255,255,0.05); position: relative; }
                .divider span { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0d1117; padding: 0 15px; font-size: 9px; color: #475569; font-weight: 800; letter-spacing: 1px; }
                
                .auth-footer { text-align: center; margin-top: 35px; color: #64748b; font-size: 13px; font-weight: 600; }
                .glow-link { color: var(--accent-green); text-decoration: none; margin-left: 5px; font-weight: 800; }
                
                .auth-error { color: #ef4444; font-size: 12px; font-weight: 600; margin-bottom: 25px; background: rgba(239, 68, 68, 0.05); padding: 14px; border-radius: 10px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1); }
            `}</style>
        </div>
    );
};

export default Login;
