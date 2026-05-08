import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    UserPlus, Mail, Lock, User, Ruler, Weight, Calendar
} from 'lucide-react';
import API_BASE_URL from '../api/config';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
     const [gender, setGender] = useState('');
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     const [submitted, setSubmitted] = useState(false);
     const [emailSent, setEmailSent] = useState(false);
    
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/signup`, { 
                name, email, password, weight, height, age, gender 
            });
            setEmailSent(data.emailSent);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred during signup');
        } finally {
            setLoading(false);
        }
        
    };

    if (submitted) {
        return (
            <div style={{ background: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '60px 50px', width: '100%', maxWidth: '480px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>{emailSent ? '📧' : '🎉'}</div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '32px', letterSpacing: '2px', color: '#00ff89', margin: '0 0 15px' }}>
                        {emailSent ? 'CHECK YOUR EMAIL!' : 'ACCOUNT CREATED!'}
                    </h2>
                    <p style={{ color: '#94a3b8', lineHeight: '1.8', marginBottom: '35px' }}>
                        {emailSent ? `We've sent a verification link to ${email}.` : 'Your account is ready! You can now login.'}
                    </p>
                    <Link to="/login" style={{ background: '#00ff89', color: 'black', padding: '14px 40px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '14px', letterSpacing: '1px' }}>
                        GO TO LOGIN
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '50px', width: '100%', maxWidth: '450px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(0,255,137,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(0,255,137,0.2)', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: '-5px', border: '1px dashed rgba(0,255,137,0.2)', borderRadius: '50%', animation: 'spin 10s linear infinite' }}></div>
                        <UserPlus size={32} color="#00ff89" />
                    </div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '2px', color: 'white', margin: '0' }}>JOIN THE ELITE</h2>
                    <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginTop: '5px' }}>Create your account to begin your transformation</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>FULL NAME</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 20px' }}>
                            <User size={18} color="#475569" style={{ marginRight: '15px' }} />
                            <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>EMAIL ADDRESS</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 20px' }}>
                            <Mail size={18} color="#475569" style={{ marginRight: '15px' }} />
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>PASSWORD</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 20px' }}>
                            <Lock size={18} color="#475569" style={{ marginRight: '15px' }} />
                            <input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>WEIGHT (KG)</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 15px' }}>
                                <Weight size={16} color="#475569" style={{ marginRight: '10px', flexShrink: 0 }} />
                                <input type="number" placeholder="0.0" value={weight} onChange={(e) => setWeight(e.target.value)}
                                    style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', width: '100%', outline: 'none', minWidth: 0 }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>HEIGHT (CM)</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 15px' }}>
                                <Ruler size={16} color="#475569" style={{ marginRight: '10px', flexShrink: 0 }} />
                                <input type="number" placeholder="0" value={height} onChange={(e) => setHeight(e.target.value)}
                                    style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', width: '100%', outline: 'none', minWidth: 0 }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>AGE (YEARS)</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 20px' }}>
                            <Calendar size={18} color="#475569" style={{ marginRight: '15px' }} />
                            <input type="number" placeholder="Enter your age" value={age} onChange={(e) => setAge(e.target.value)}
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>GENDER</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#080c10', border: '1px solid #1f2937', borderRadius: '12px', padding: '0 20px' }}>
                            <User size={18} color="#475569" style={{ marginRight: '15px' }} />
                            <select value={gender} onChange={(e) => setGender(e.target.value)} required
                                style={{ background: 'none', border: 'none', padding: '14px 0', color: 'white', flex: 1, outline: 'none', appearance: 'none' }}>
                                <option value="" style={{background: '#0d1117'}}>Select Gender</option>
                                <option value="male" style={{background: '#0d1117'}}>Male</option>
                                <option value="female" style={{background: '#0d1117'}}>Female</option>
                                <option value="other" style={{background: '#0d1117'}}>Other</option>
                            </select>
                        </div>
                    </div>



                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '15px', background: 'rgba(239,68,68,0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.1)' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '16px', background: '#00ff89', color: 'black',
                        border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer'
                    }}>
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                    Already a member? <Link to="/login" style={{ color: '#00ff89', textDecoration: 'none', fontWeight: '800', marginLeft: '5px' }}>Login Here</Link>
                </div>
            </div>



            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Signup;
