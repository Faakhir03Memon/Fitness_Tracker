import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, SendHorizonal } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
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
                {!sent ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                            <div style={{
                                width: '75px', height: '75px', borderRadius: '50%',
                                background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                            }}>
                                <Mail size={32} color="#f59e0b" />
                            </div>
                            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '2px', color: 'white', margin: '0' }}>FORGOT PASSWORD</h2>
                            <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '5px' }}>Enter your email to receive a reset link</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '1.2px', marginBottom: '10px' }}>
                                    EMAIL ADDRESS
                                </label>
                                <div style={{
                                    display: 'flex', alignItems: 'center', background: '#080c10',
                                    border: '1px solid #1e293b', borderRadius: '12px', padding: '0 18px'
                                }}>
                                    <Mail size={18} color="#334155" style={{ marginRight: '12px' }} />
                                    <input
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                width: '100%', padding: '16px', background: '#f59e0b', color: 'black',
                                border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}>
                                <SendHorizonal size={18} />
                                {loading ? 'SENDING...' : 'SEND RESET LINK'}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Link to="/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                <ArrowLeft size={14} /> Back to Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📧</div>
                        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '30px', letterSpacing: '2px', color: '#00ff89' }}>CHECK YOUR EMAIL!</h2>
                        <p style={{ color: '#94a3b8', lineHeight: '1.7', marginBottom: '10px' }}>
                            We've sent a password reset link to:
                        </p>
                        <p style={{ color: '#f59e0b', fontWeight: '800', marginBottom: '30px' }}>{email}</p>
                        <p style={{ color: '#475569', fontSize: '12px', marginBottom: '30px' }}>
                            The link expires in 1 hour. Check your spam folder if you don't see it.
                        </p>
                        <Link to="/login" style={{
                            background: '#00ff89', color: 'black', padding: '14px 35px',
                            borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '14px'
                        }}>BACK TO LOGIN</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
