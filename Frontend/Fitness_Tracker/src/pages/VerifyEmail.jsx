import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
                setMessage(data.message);
                setStatus('success');
            } catch (err) {
                setMessage(err.response?.data?.message || 'Verification failed.');
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    return (
        <div style={{
            background: '#030712', minHeight: '100vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <div style={{
                background: 'rgba(13,17,23,0.9)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '32px', padding: '60px 50px', width: '100%', maxWidth: '480px',
                textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
            }}>
                {status === 'loading' && (
                    <>
                        <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginBottom: '20px' }}>
                            <Loader size={50} color="#00ff89" />
                        </div>
                        <h2 style={{ color: 'white', fontFamily: 'Bebas Neue', fontSize: '30px', letterSpacing: '2px' }}>VERIFYING YOUR EMAIL</h2>
                        <p style={{ color: '#64748b' }}>Please wait a moment...</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle size={60} color="#00ff89" style={{ marginBottom: '20px' }} />
                        <h2 style={{ color: '#00ff89', fontFamily: 'Bebas Neue', fontSize: '30px', letterSpacing: '2px' }}>EMAIL VERIFIED!</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '35px', lineHeight: '1.7' }}>{message}</p>
                        <Link to="/login" style={{
                            background: '#00ff89', color: 'black', padding: '16px 40px',
                            borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '14px', letterSpacing: '1px'
                        }}>GO TO LOGIN</Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <XCircle size={60} color="#ef4444" style={{ marginBottom: '20px' }} />
                        <h2 style={{ color: '#ef4444', fontFamily: 'Bebas Neue', fontSize: '30px', letterSpacing: '2px' }}>VERIFICATION FAILED</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '35px' }}>{message}</p>
                        <Link to="/signup" style={{
                            background: '#ef4444', color: 'white', padding: '16px 40px',
                            borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '14px'
                        }}>TRY AGAIN</Link>
                    </>
                )}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default VerifyEmail;
