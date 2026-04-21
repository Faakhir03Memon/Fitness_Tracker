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

    // Initialize Social SDKs
    useEffect(() => {
        /* global google, FB */
        // Google Init
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
                callback: handleGoogleResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("googleBtn"),
                { theme: "outline", size: "large", width: "100%" }
            );
        }

        // Facebook Init
        window.fbAsyncInit = function() {
            FB.init({
              appId      : 'YOUR_FB_APP_ID', // Replace with real FB App ID
              cookie     : true,
              xfbml      : true,
              version    : 'v21.0'
            });
        };
    }, []);

    const handleGoogleResponse = async (response) => {
        const userObject = decodeJwt(response.credential);
        if (!userObject) return;
        socialAuth(userObject.email, userObject.name, 'google');
    };

    const handleFBLogin = () => {
        /* global FB */
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', {fields: 'name,email'}, function(resp) {
                    socialAuth(resp.email, resp.name, 'facebook');
                });
            }
        }, {scope: 'public_profile,email'});
    };

    const socialAuth = async (email, name, provider) => {
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/social-login', { email, name, provider });
            login(data);
            navigate('/');
        } catch (err) {
            setError(`${provider.toUpperCase()} authentication failed.`);
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

    return (
        <div className="auth-container premium-dark">
            <div className="auth-card glassmorphism animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                         <div className="logo-ring"></div>
                         <ShieldCheck size={32} color="var(--accent-green)" />
                    </div>
                    <h2 className="bebas-font">ELITE ACCESS</h2>
                    <p className="auth-subtitle">Level up your fitness journey today</p>
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
                    
                    <div className="divider"><span>CONTINUE WITH SOCIALS</span></div>
                    
                    <div className="social-stack">
                        <div id="googleBtn" style={{marginBottom: '12px', width: '100%'}}></div>
                        
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                            <button type="button" className="fb-login-btn" onClick={handleFBLogin}>
                                <Globe size={18} style={{marginRight: '8px'}} /> Facebook
                            </button>
                            <button type="button" className="social-btn" onClick={() => socialAuth(`github_${Math.random().toString(36).substring(7)}@example.com`, 'Github User', 'github')}>
                                <Terminal size={18} style={{marginRight: '8px'}} /> Github
                            </button>
                        </div>
                    </div>
                </form>

                <div className="auth-footer">
                    New to FitTrack? <Link to="/signup" className="glow-link">Create Account</Link>
                </div>
            </div>

            <style>{`
                .premium-dark { background: #030712; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .auth-card { background: rgba(13, 17, 23, 0.82); border: 1px solid rgba(255,255,255,0.06); border-radius: 32px; padding: 45px; width: 100%; max-width: 440px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                .bebas-font { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: 3px; color: white; margin: 0; }
                .auth-subtitle { color: #64748b; font-size: 13px; font-weight: 600; margin-top: 5px; }
                .auth-header { text-align: center; margin-bottom: 35px; }
                .auth-logo { width: 75px; height: 75px; border-radius: 50%; background: rgba(0, 255, 137, 0.05); display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(0, 255, 137, 0.2); position: relative; }
                .logo-ring { position: absolute; inset: -4px; border: 1px dashed rgba(0, 255, 137, 0.3); border-radius: 50%; animation: spin 12s linear infinite; }
                @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
                
                .input-group { margin-bottom: 20px; }
                .input-group label { display: block; font-size: 10px; font-weight: 900; color: #475569; letter-spacing: 1.5px; margin-bottom: 10px; }
                .input-field { display: flex; align-items: center; background: #080c10; border: 1px solid #1e293b; border-radius: 12px; padding: 0 18px; transition: 0.3s; }
                .input-field svg { color: #334155; margin-right: 12px; }
                .input-field input { background: none; border: none; padding: 14px 0; color: white; flex: 1; outline: none; font-size: 14px; }
                .input-field:focus-within { border-color: var(--accent-green); background: #0c121a; }
                
                .login-btn { width: 100%; padding: 15px; background: var(--accent-green); color: black; border: none; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; margin-top: 5px; }
                .login-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0, 255, 137, 0.25); }
                
                .divider { text-align: center; margin: 30px 0; border-top: 1px solid rgba(255,255,255,0.04); position: relative; }
                .divider span { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0d1117; padding: 0 15px; font-size: 9px; color: #475569; font-weight: 800; letter-spacing: 1.5px; white-space: nowrap; }
                
                .social-stack { width: 100%; }
                .fb-login-btn { display: flex; align-items: center; justify-content: center; background: #1877F2; color: white; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 12px; border: none; cursor: pointer; transition: 0.3s; }
                .fb-login-btn:hover { background: #1565D8; transform: translateY(-2px); }
                .social-btn { display: flex; align-items: center; justify-content: center; background: #080c10; border: 1px solid #1e293b; color: white; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer; transition: 0.3s; }
                .social-btn:hover { border-color: white; transform: translateY(-2px); }
                
                .auth-footer { text-align: center; margin-top: 35px; color: #475569; font-size: 13px; font-weight: 600; }
                .glow-link { color: var(--accent-green); text-decoration: none; margin-left: 5px; font-weight: 800; transition: 0.3s; }
                .glow-link:hover { text-shadow: 0 0 10px rgba(0,255,137,0.5); }
                
                .auth-error { color: #f87171; font-size: 12px; font-weight: 600; margin-bottom: 25px; background: rgba(239, 68, 68, 0.05); padding: 14px; border-radius: 12px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.12); }
            `}</style>
        </div>
    );
};

export default Login;
