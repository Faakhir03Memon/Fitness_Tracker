import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, User as UserIcon } from 'lucide-react';

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
            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-slide-up">
                <div className="auth-header">
                    <div className="auth-icon-circle">
                        <LogIn size={32} color="#4f46e5" />
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Enter your details to track your progress</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>

            <style>{`
                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0f172a;
                    padding: 20px;
                }
                .auth-card {
                    background: #1e293b;
                    border: 1px solid #334155;
                    border-radius: 16px;
                    padding: 40px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .auth-icon-circle {
                    background: #312e81;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                }
                .auth-header h2 { color: white; margin-bottom: 5px; }
                .auth-header p { color: #94a3b8; font-size: 0.9rem; }
                
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; color: #cbd5e1; margin-bottom: 8px; font-size: 0.85rem; }
                
                .input-with-icon { position: relative; }
                .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748b; }
                
                input {
                    width: 100%;
                    padding: 12px 12px 12px 40px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 8px;
                    color: white;
                    transition: border 0.2s;
                }
                input:focus { border-color: #6366f1; outline: none; }
                
                .auth-btn {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                }
                .auth-btn:hover { transform: translateY(-2px); background: #4338ca; }
                .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                
                .error-message { color: #ef4444; background: #450a0a; padding: 10px; border-radius: 6px; font-size: 0.8rem; margin-bottom: 20px; border: 1px solid #7f1d1d; }
                
                .auth-footer { text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.9rem; }
                .auth-footer a { color: #6366f1; text-decoration: none; font-weight: 600; }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Login;
