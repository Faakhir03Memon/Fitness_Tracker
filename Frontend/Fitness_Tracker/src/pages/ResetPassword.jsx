import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            return setError('Passwords do not match.');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }
        setLoading(true);
        setError('');
        try {
            await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            
            // Logout the user to clear any old session before redirecting to login
            logout();
            
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. Link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: '#030712', minHeight: '100vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <div style={{
                background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '32px', padding: '50px', width: '100%', maxWidth: '440px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
            }}>
                {!success ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                            <div style={{
                                width: '75px', height: '75px', borderRadius: '50%',
                                background: 'rgba(0,255,137,0.05)', border: '1px solid rgba(0,255,137,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                            }}>
                                <ShieldCheck size={32} color="#00ff89" />
                            </div>
                            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '2px', color: 'white', margin: '0' }}>SET NEW PASSWORD</h2>
                            <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '5px' }}>Choose a strong new password for your account</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '1.2px', marginBottom: '10px' }}>NEW PASSWORD</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1e293b', borderRadius: '12px', padding: '0 18px' }}>
                                    <Lock size={18} color="#334155" style={{ marginRight: '12px' }} />
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none', fontSize: '14px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '1.2px', marginBottom: '10px' }}>CONFIRM PASSWORD</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1e293b', borderRadius: '12px', padding: '0 18px' }}>
                                    <Lock size={18} color="#334155" style={{ marginRight: '12px' }} />
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        required
                                        style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none', fontSize: '14px' }}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '15px', background: 'rgba(239,68,68,0.05)', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.1)' }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '16px', background: '#00ff89', color: 'black',
                                border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer'
                            }}>
                                {loading ? 'UPDATING...' : 'RESET PASSWORD'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
                        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '30px', letterSpacing: '2px', color: '#00ff89' }}>PASSWORD RESET!</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '10px' }}>Your password has been updated successfully.</p>
                        <p style={{ color: '#64748b', fontSize: '13px' }}>Redirecting you to login...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
