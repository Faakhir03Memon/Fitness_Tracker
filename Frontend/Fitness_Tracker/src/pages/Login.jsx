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
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const [googleEmail, setGoogleEmail] = useState('');
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

    const handleGoogleAuth = async (isDefault = true) => {
        const finalEmail = isDefault ? "farrukh.fabtex@gmail.com" : googleEmail;
        if (!finalEmail) return;

        setLoading(true);
        setShowGoogleModal(false);
        try {
            const socialData = {
                email: finalEmail,
                name: finalEmail.split('@')[0],
                provider: 'google'
            };
            const { data } = await axios.post('http://localhost:5000/api/auth/social-login', socialData);
            login(data);
            navigate('/');
        } catch (err) {
            setError("Google authentication failed.");
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
                    <h2 className="bebas-font">SELECT ACCESS</h2>
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
                    
                    <div className="divider"><span>OR SIGN IN WITH</span></div>
                    
                    <button type="button" className="official-google-btn" onClick={() => setShowGoogleModal(true)}>
                        <div className="google-icon-box">
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.34-.17-1.98H10v3.74h5.38c-.23 1.25-.94 2.3-2 3.14l3.23 2.51c1.89-1.74 2.99-4.3 2.99-7.41z"/>
                                <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.61-2.43l-3.23-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.81-1.76-5.6-4.12H1.05v2.6C2.71 17.85 6.09 20 10 20z"/>
                                <path fill="#FBBC05" d="M4.4 11.91c-.2-.6-.31-1.24-.31-1.91s.11-1.31.31-1.91V5.49H1.05A9.976 9.976 0 0 0 0 10c0 1.62.39 3.15 1.05 4.51l3.35-2.6z"/>
                                <path fill="#EA4335" d="M10 4.02c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95 1.04 12.69 0 10 0 6.09 0 2.71 2.15 1.05 5.49L4.4 8.09c.79-2.36 3-4.07 5.6-4.07z"/>
                            </svg>
                        </div>
                        <span className="google-btn-text">Sign in with Google</span>
                    </button>
                </form>

                <div className="auth-footer">
                    New to FitTrack? <Link to="/signup" className="glow-link">Create Account</Link>
                </div>
            </div>

            {showGoogleModal && (
                <div className="google-modal-overlay">
                    <div className="google-modal animate-fade-in">
                        <div className="google-modal-header">
                            <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png" alt="Google" width="70"/>
                            <h3>Sign in</h3>
                            <p>To continue to FitTrack</p>
                        </div>
                        <div className="google-modal-body">
                            <div className="suggested-account" onClick={() => handleGoogleAuth(true)}>
                                <div className="user-icon">{ "F" }</div>
                                <div className="user-info">
                                    <span className="user-name">Farrukh Fabtex</span>
                                    <span className="user-email">farrukh.fabtex@gmail.com</span>
                                </div>
                            </div>
                            
                            <div className="divider"><span>OR USE ANOTHER EMAIL</span></div>
                            
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                className="google-input"
                                value={googleEmail}
                                onChange={(e) => setGoogleEmail(e.target.value)}
                            />
                            <button className="google-next-btn" onClick={() => handleGoogleAuth(false)}>Next</button>
                        </div>
                        <button className="google-cancel" onClick={() => setShowGoogleModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <style>{`
                .premium-dark { background: #030712; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .auth-card { background: rgba(13, 17, 23, 0.82); border: 1px solid rgba(255,255,255,0.06); border-radius: 32px; padding: 45px; width: 100%; max-width: 440px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
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
                
                .official-google-btn { width: 100%; background: white; border: 1px solid #dadce0; border-radius: 12px; padding: 0; height: 50px; display: flex; align-items: center; cursor: pointer; transition: background-color .2s,box-shadow .2s; overflow: hidden; }
                .google-icon-box { background: white; height: 100%; width: 50px; display: flex; align-items: center; justify-content: center; }
                .google-btn-text { flex: 1; color: #3c4043; font-weight: 700; font-family: 'Roboto',arial,sans-serif; font-size: 14px; padding-right: 50px; text-align: center; }

                .google-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .google-modal { background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 8px; text-align: center; color: #3c4043; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .google-modal-header h3 { font-size: 24px; margin-top: 15px; margin-bottom: 5px; }
                .google-modal-header p { font-size: 16px; color: #5f6368; margin-bottom: 30px; }
                
                .suggested-account { display: flex; align-items: center; padding: 15px; border: 1px solid #dadce0; border-radius: 50px; margin-bottom: 20px; cursor: pointer; transition: 0.2s; }
                .suggested-account:hover { background: #f8f9fa; }
                .user-icon { width: 35px; height: 35px; background: #6366f1; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 15px; }
                .user-info { text-align: left; }
                .user-name { display: block; font-weight: 700; font-size: 14px; }
                .user-email { display: block; font-size: 12px; color: #5f6368; }
                
                .google-input { width: 100%; padding: 15px; border: 1px solid #dadce0; border-radius: 4px; margin-bottom: 15px; outline: none; font-size: 16px; }
                .google-input:focus { border-color: #4285f4; border-width: 2px; padding: 14px; }
                .google-next-btn { width: 100%; background: #1a73e8; color: white; border: none; padding: 12px; border-radius: 4px; font-weight: 700; cursor: pointer; transition: 0.2s; }
                .google-next-btn:hover { background: #1557b0; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
                .google-cancel { background: none; border: none; color: #5f6368; margin-top: 20px; cursor: pointer; font-size: 14px; font-weight: 600; }
                .google-cancel:hover { color: #202124; }

                .auth-footer { text-align: center; margin-top: 35px; color: #64748b; font-size: 13px; font-weight: 600; }
                .glow-link { color: var(--accent-green); text-decoration: none; margin-left: 5px; font-weight: 800; }
                .auth-error { color: #ef4444; font-size: 12px; font-weight: 600; margin-bottom: 25px; background: rgba(239, 68, 68, 0.05); padding: 14px; border-radius: 10px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1); }
            `}</style>
        </div>
    );
};

export default Login;
