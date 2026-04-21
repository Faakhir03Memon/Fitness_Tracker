import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck, User, Search, Globe, Terminal } from 'lucide-react';
const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Initialize Google Login
    useEffect(() => {
        /* global google */
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace with real ID
                callback: handleGoogleResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("googleBtn"),
                { theme: "outline", size: "large", width: "100%" }
            );
        }
    }, []);

    const handleGoogleResponse = async (response) => {
        const userObject = decodeJwt(response.credential);
        if (!userObject) return;
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/social-login', {
                email: userObject.email,
                name: userObject.name,
                provider: 'google'
            });
            login(data);
            navigate('/');
        } catch (err) {
            setError("Google sign-in failed.");
        } finally {
            setLoading(false);
        }
    };

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

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        try {
            const socialData = {
                email: `guest_${provider}@example.com`,
                name: `Social User (${provider})`,
                provider
            };
            const { data } = await axios.post('http://localhost:5000/api/auth/social-login', socialData);
            login(data);
            navigate('/');
        } catch (err) {
            setError("Social login failed.");
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
                    <h2 className="bebas-font">WELCOME BACK</h2>
                    <p className="auth-subtitle">Login to access your high-performance dashboard</p>
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
                        {loading ? 'AUTHENTICATING...' : 'LOGIN TO ACCOUNT'}
                    </button>
                    
                    <div className="divider"><span>OR CONTINUE WITH OFFICIAL GOOGLE SIGN-IN</span></div>
                    
                    <div id="googleBtn" style={{marginBottom: '20px', width: '100%'}}></div>

                    <div className="divider"><span>OR OTHER SOCIALS</span></div>
                    
                    <div className="social-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                        <button type="button" className="social-btn" onClick={() => handleSocialLogin('facebook')}>
                            <Globe size={18} style={{marginRight: '8px'}}/> Facebook
                        </button>
                        <button type="button" className="social-btn" onClick={() => handleSocialLogin('github')}>
                            <Terminal size={18} style={{marginRight: '8px'}}/> Github
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    New to FitTrack? <Link to="/signup" className="glow-link">Create Account</Link>
                </div>
            </div>

            <style>{`
                .premium-dark { background: #030712; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .auth-card { background: rgba(13, 17, 23, 0.8); border: 1px solid rgba(255,255,255,0.05); border-radius: 32px; padding: 50px; width: 100%; max-width: 450px; }
                .bebas-font { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 2px; color: white; margin: 0; }
                .auth-subtitle { color: #94a3b8; font-size: 13px; font-weight: 600; margin-top: 5px; }
                .auth-header { text-align: center; margin-bottom: 30px; }
                .auth-logo { width: 70px; height: 70px; border-radius: 50%; background: rgba(0, 255, 137, 0.05); display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(0, 255, 137, 0.2); position: relative; }
                .logo-ring { position: absolute; inset: -5px; border: 1px dashed rgba(0, 255, 137, 0.2); border-radius: 50%; animation: spin 10s linear infinite; }
                @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
                
                .input-group { margin-bottom: 20px; }
                .input-group label { display: block; font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 1px; margin-bottom: 8px; }
                .input-field { display: flex; align-items: center; background: #080c10; border: 1px solid #1f2937; border-radius: 12px; padding: 0 18px; outline: 1px solid transparent; transition: 0.3s; }
                .input-field svg { color: #475569; margin-right: 12px; }
                .input-field input { background: none; border: none; padding: 12px 0; color: white; flex: 1; outline: none; font-size: 14px; }
                .input-field:focus-within { border-color: var(--accent-green); outline-color: rgba(0,255,137,0.1); }
                
                .login-btn { width: 100%; padding: 14px; background: var(--accent-green); color: black; border: none; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; margin-top: 5px; }
                .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0, 255, 137, 0.2); }
                
                .divider { text-align: center; margin: 25px 0; border-top: 1px solid rgba(255,255,255,0.05); position: relative; }
                .divider span { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0d1117; padding: 0 10px; font-size: 9px; color: #475569; font-weight: 800; letter-spacing: 1px; white-space: nowrap; }
                
                .social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .social-btn { display: flex; align-items: center; justify-content: center; background: #080c10; border: 1px solid #1f2937; color: white; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer; transition: 0.3s; }
                .social-btn:hover { background: #111827; border-color: white; }
                
                .auth-footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 13px; font-weight: 600; }
                .glow-link { color: var(--accent-green); text-decoration: none; margin-left: 5px; font-weight: 700; }
                .auth-error { color: #ef4444; font-size: 12px; font-weight: 600; margin-bottom: 20px; background: rgba(239, 68, 68, 0.05); padding: 12px; border-radius: 10px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1); }
            `}</style>
        </div>
    );
};

export default Login;
