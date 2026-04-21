import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Search, ArrowRight, Globe, Terminal } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Initialize Facebook SDK
    useEffect(() => {
        /* global FB */
        if (typeof window.FB === 'undefined') {
            window.fbAsyncInit = function() {
                FB.init({
                    appId      : 'YOUR_FB_APP_ID', // Replace with real FB App ID
                    cookie     : true,
                    xfbml      : true,
                    version    : 'v21.0'
                });
            };
        }
    }, []);

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

    const handleFBAuth = () => {
        /* global FB */
        if (typeof FB === 'undefined') return;
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', {fields: 'name,email'}, function(resp) {
                    processSocialAuth(resp.email, resp.name, 'facebook');
                });
            }
        }, {scope: 'public_profile,email'});
    };

    const processSocialAuth = async (email, name, provider) => {
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/social-login', { 
                email, 
                name, 
                provider 
            });
            login(data);
            navigate('/');
        } catch (err) {
            setError("Social authentication failed.");
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
                    
                    <div className="divider"><span>OR QUICK SIGNUP WITH SOCIALS</span></div>
                    
                    <div className="social-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
                        <button type="button" className="social-btn" onClick={() => processSocialAuth(`google_${Math.random().toString(36).substring(7)}@example.com`, 'Google User', 'google')}>
                            <Search size={18} /> Google
                        </button>
                        <button type="button" className="social-btn" onClick={handleFBAuth} style={{background: '#1877F2', borderColor: '#1877F2'}}>
                            <Globe size={18} /> FB
                        </button>
                        <button type="button" className="social-btn" onClick={() => processSocialAuth(`github_${Math.random().toString(36).substring(7)}@example.com`, 'Github User', 'github')}>
                            <Terminal size={18} /> Git
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    Already a member? <Link to="/login" className="glow-link">Login Here</Link>
                </div>
            </div>

            <style>{`
                .premium-dark { background: #030712; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .auth-card { background: rgba(13, 17, 23, 0.85); border: 1px solid rgba(255,255,255,0.05); border-radius: 32px; padding: 45px; width: 100%; max-width: 440px; box-shadow: 0 25px 60px rgba(0,0,0,0.6); }
                .auth-header { text-align: center; margin-bottom: 35px; }
                .auth-logo { width: 70px; height: 70px; border-radius: 50%; background: rgba(0, 255, 137, 0.05); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 1px solid rgba(0, 255, 137, 0.2); position: relative; }
                .logo-ring { position: absolute; inset: -5px; border: 1px dashed rgba(0, 255, 137, 0.2); border-radius: 50%; animation: spin 10s linear infinite; }
                @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
                
                .bebas-font { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: 2px; color: white; margin: 0; }
                .auth-subtitle { color: #64748b; font-size: 13px; font-weight: 600; margin-top: 5px; }
                
                .input-group { margin-bottom: 22px; }
                .input-group label { display: block; font-size: 11px; font-weight: 800; color: #475569; letter-spacing: 1.2px; margin-bottom: 10px; }
                .input-field { display: flex; align-items: center; background: #080c10; border: 1px solid #1e293b; border-radius: 12px; padding: 0 20px; transition: 0.3s; }
                .input-field svg { color: #334155; margin-right: 15px; }
                .input-field input { background: none; border: none; padding: 14px 0; color: white; flex: 1; outline: none; font-size: 14px; }
                .input-field:focus-within { border-color: var(--accent-green); outline: 1px solid rgba(0,255,137,0.1); }
                
                .login-btn { width: 100%; padding: 16px; background: var(--accent-green); color: black; border: none; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; margin-top: 10px; }
                .login-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0, 255, 137, 0.2); }
                
                .divider { text-align: center; margin: 30px 0; border-top: 1px solid rgba(255,255,255,0.05); position: relative; }
                .divider span { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0d1117; padding: 0 15px; font-size: 9px; color: #475569; font-weight: 800; letter-spacing: 1px; }
                
                .social-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                .social-btn { display: flex; align-items: center; justify-content: center; background: #080c10; border: 1px solid #1e293b; color: white; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 11px; cursor: pointer; transition: 0.3s; }
                .social-btn:hover { border-color: white; transform: translateY(-2px); }
                
                .auth-footer { text-align: center; margin-top: 35px; color: #475569; font-size: 13px; font-weight: 600; }
                .glow-link { color: var(--accent-green); text-decoration: none; margin-left: 5px; font-weight: 800; }
                .auth-error { color: #f87171; font-size: 12px; font-weight: 600; margin-bottom: 20px; background: rgba(239, 68, 68, 0.05); padding: 14px; border-radius: 10px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1); }
            `}</style>
        </div>
    );
};

export default Signup;
