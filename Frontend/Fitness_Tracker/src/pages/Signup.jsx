import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
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
            const { data } = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            const socialData = {
                email: `google_user_${Math.floor(Math.random()*1000)}@example.com`,
                name: `Google User`,
                provider: 'google'
            };
            const { data } = await axios.post('http://localhost:5000/api/auth/social-login', socialData);
            login(data);
            navigate('/');
        } catch (err) {
            setError("Google signup failed.");
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
                         <UserPlus size={32} color="var(--accent-green)" />
                    </div>
                    <h2 className="bebas-font">JOIN THE ELITE</h2>
                    <p className="auth-subtitle">Create account to start your transformation</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>FULL NAME</label>
                        <div className="input-field">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
                    </button>
                    
                    <div className="divider"><span>OR QUICK JOIN WITH GOOGLE</span></div>

                    <button type="button" className="google-custom-btn" onClick={handleGoogleSignup}>
                         <div className="google-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.24h2.91c1.71-1.58 2.69-3.91 2.69-6.6z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.34 0-4.33-1.58-5.04-3.71H.96v2.3A8.99 8.99 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.96 10.74A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.18.27-1.74l-2.31-2.3A8.99 8.99 0 0 0 0 9c0 1.9.59 3.65 1.59 5.09l2.37-1.35z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A8.96 8.96 0 0 0 9 0 8.99 8.99 0 0 0 .96 5.7l2.31 2.3c.71-2.13 2.7-3.71 5.04-3.71z"/></svg>
                         </div>
                         <span>Sign up with Google</span>
                    </button>
                </form>

                <div className="auth-footer">
                    Already a member? <Link to="/login" className="glow-link">Login Here</Link>
                </div>
            </div>

            <style>{`
                .premium-dark { background: #030712; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .auth-card { background: rgba(13, 17, 23, 0.85); border: 1px solid rgba(255,255,255,0.05); border-radius: 32px; padding: 50px; width: 100%; max-width: 450px; }
                .auth-header { text-align: center; margin-bottom: 40px; }
                .auth-logo { width: 70px; height: 70px; border-radius: 50%; background: rgba(0, 255, 137, 0.05); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 1px solid rgba(0, 255, 137, 0.2); position: relative; }
                .logo-ring { position: absolute; inset: -5px; border: 1px dashed rgba(0, 255, 137, 0.2); border-radius: 50%; animation: spin 10s linear infinite; }
                @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
                
                .bebas-font { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 2px; color: white; }
                .auth-subtitle { color: #94a3b8; font-size: 13px; font-weight: 600; }
                
                .input-group { margin-bottom: 22px; }
                .input-group label { display: block; font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 1px; margin-bottom: 10px; }
                .input-field { display: flex; align-items: center; background: #080c10; border: 1px solid #1f2937; border-radius: 12px; padding: 0 20px; outline: 1px solid transparent; transition: 0.3s; }
                .input-field svg { color: #475569; margin-right: 15px; }
                .input-field input { background: none; border: none; padding: 14px 0; color: white; flex: 1; outline: none; }
                .input-field:focus-within { border-color: var(--accent-green); outline-color: rgba(0,255,137,0.1); }
                
                .login-btn { width: 100%; padding: 16px; background: var(--accent-green); color: black; border: none; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; margin-top: 10px; }
                .login-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0, 255, 137, 0.2); }
                
                .divider { text-align: center; margin: 25px 0; border-top: 1px solid rgba(255,255,255,0.05); position: relative; }
                .divider span { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0d1117; padding: 0 15px; font-size: 10px; color: #475569; font-weight: 800; letter-spacing: 1px; }
                
                .google-custom-btn { width: 100%; background: white; color: #3c4043; border: 1px solid #dadce0; border-radius: 12px; padding: 12px; font-weight: 600; font-size: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; margin-top: 10px; }
                .google-custom-btn:hover { background: #f8f9fa; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
                .google-icon-wrapper { margin-right: 12px; display: flex; align-items: center; }

                .auth-footer { text-align: center; margin-top: 35px; color: #64748b; font-size: 13px; font-weight: 600; }
                .glow-link { color: var(--accent-green); text-decoration: none; margin-left: 5px; border-bottom: 1px dashed transparent; transition: 0.3s; }
                .glow-link:hover { border-color: var(--accent-green); text-shadow: 0 0 10px rgba(0,255,137,0.5); }
                
                .auth-error { color: #ef4444; font-size: 12px; font-weight: 600; margin-bottom: 15px; background: rgba(239, 68, 68, 0.05); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1); }
            `}</style>
        </div>
    );
};

export default Signup;
