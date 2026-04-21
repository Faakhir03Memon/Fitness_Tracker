import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/signup', formData);
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-scale-in">
                <div className="auth-header">
                    <div className="auth-icon-circle accent">
                        <UserPlus size={32} color="#10b981" />
                    </div>
                    <h2>Create Account</h2>
                    <p>Join FitTrack today and start your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-with-icon">
                            <UserIcon size={18} className="input-icon" />
                            <input
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="auth-btn signup" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
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
                .auth-icon-circle.accent { background: #064e3b; }
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
                input:focus { border-color: #10b981; outline: none; }
                
                .auth-btn {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                }
                .auth-btn:hover { transform: translateY(-2px); background: #047857; }
                .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                
                .error-message { color: #ef4444; background: #450a0a; padding: 10px; border-radius: 6px; font-size: 0.8rem; margin-bottom: 20px; border: 1px solid #7f1d1d; }
                
                .auth-footer { text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.9rem; }
                .auth-footer a { color: #10b981; text-decoration: none; font-weight: 600; }
                
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Signup;
