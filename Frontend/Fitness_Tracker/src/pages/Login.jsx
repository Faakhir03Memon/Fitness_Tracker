import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [notVerified, setNotVerified] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setNotVerified(false);
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            login(data);
            if (data.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            if (err.response?.data?.notVerified) {
                setNotVerified(true);
            }
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'rgba(13,17,23,0.82)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '45px', width: '100%', maxWidth: '440px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <div style={{ width: '75px', height: '75px', borderRadius: '50%', background: 'rgba(0,255,137,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', border: '1px solid rgba(0,255,137,0.2)', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: '-5px', border: '1px dashed rgba(0,255,137,0.3)', borderRadius: '50%', animation: 'spin 12s linear infinite' }}></div>
                        <ShieldCheck size={32} color="#00ff89" />
                    </div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '38px', letterSpacing: '2px', color: 'white', margin: '0' }}>ELITE ACCESS</h2>
                    <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '5px' }}>Login to your fitness command center</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '1.2px', marginBottom: '10px' }}>EMAIL ADDRESS</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1e293b', borderRadius: '12px', padding: '0 18px' }}>
                            <Mail size={18} color="#334155" style={{ marginRight: '12px' }} />
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none', fontSize: '14px' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '5px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '1.2px', marginBottom: '10px' }}>PASSWORD</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1e293b', borderRadius: '12px', padding: '0 18px' }}>
                            <Lock size={18} color="#334155" style={{ marginRight: '12px' }} />
                            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none', fontSize: '14px' }} />
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '10px' }}>
                        <Link to="/forgot-password" style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '15px', background: 'rgba(239,68,68,0.05)', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.1)' }}>
                            {error}
                            {notVerified && (
                                <div style={{ marginTop: '8px', color: '#f59e0b', fontWeight: '700' }}>
                                    📧 Check your inbox and click the verification link.
                                </div>
                            )}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '16px', background: '#00ff89', color: 'black',
                        border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: '0.3s'
                    }}>
                        {loading ? 'VERIFYING...' : 'LOGIN TO ACCOUNT'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                    New to FitTrack? <Link to="/signup" style={{ color: '#00ff89', textDecoration: 'none', fontWeight: '800', marginLeft: '5px' }}>Create Account</Link>
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Login;
