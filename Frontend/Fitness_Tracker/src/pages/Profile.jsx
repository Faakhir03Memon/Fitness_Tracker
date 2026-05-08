import React, { useState, useRef } from 'react';
import { Camera, Settings, Shield, Bell, Trophy, LogOut, Save, X, User as UserIcon, Mail, Ruler, Weight, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    weight: user?.weight || '',
    height: user?.height || '',
    age: user?.age || '',
    gender: user?.gender || '',
    password: '',
    avatar: user?.avatar || ''
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, avatar: base64String }));
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.put(`${API_BASE_URL}/api/auth/profile`, { ...formData, avatar: base64String }, config);
          login(data);
          setMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (err) {
          setMessage({ type: 'error', text: 'Failed to upload profile picture' });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.put(`${API_BASE_URL}/api/auth/profile`, formData, config);
      login(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <main className="main profile-page">
      <div className="topbar">
        <div className="greeting">
          <h1 className="glitch-text">MY PROFILE</h1>
          <p>Global ranking: Top 5% in your region</p>
        </div>
        <div className="topbar-right">
          {!isEditing ? (
            <button className="premium-btn edit" onClick={() => setIsEditing(true)}>
              <Settings size={18} /> Edit Profile
            </button>
          ) : (
            <button className="premium-btn cancel" onClick={() => setIsEditing(false)}>
              <X size={18} /> Cancel
            </button>
          )}
          <button className="premium-btn logout" onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`toast-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-hero-card">
        <div className="hero-content">
          <div className="avatar-wrapper">
            <div className="avatar-main" style={formData.avatar || user?.avatar ? { backgroundImage: `url(${formData.avatar || user?.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}>
              {!(formData.avatar || user?.avatar) && (user?.name?.charAt(0) || 'U')}
              <div className="avatar-ring"></div>
            </div>
            <button className="avatar-edit-btn" onClick={() => fileInputRef.current.click()}>
              <Camera size={14} />
            </button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
          </div>

          <div className="user-info-main">
            <h2 className="user-name">{user?.name}</h2>
            <div className="user-badges">
                <span className="badge eco">Verified Athlete</span>
                <span className="badge pro">{user?.role === 'admin' ? 'System Master' : 'Pro Member'}</span>
            </div>
          </div>

          <div className="quick-metrics">
             <MetricBox icon={<Weight size={20} />} label="Weight" value={user?.weight || '--'} unit="kg" />
             <MetricBox icon={<Ruler size={20} />} label="Height" value={user?.height || '--'} unit="cm" />
             <MetricBox icon={<Calendar size={20} />} label="Age" value={user?.age || '--'} unit="yrs" />
             <MetricBox icon={<UserIcon size={20} />} label="Gender" value={user?.gender || '--'} unit="" />
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form-wrapper animate-fade-in">
            <div className="section-label">UPDATE PERSONAL DETAILS</div>
            <form onSubmit={handleUpdate} className="modern-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label><UserIcon size={14}/> Full Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Your display name"
                        />
                    </div>
                    <div className="form-group">
                        <label><Mail size={14}/> Email Address</label>
                        <input 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className="form-group text-input">
                        <label><Weight size={14}/> Body Weight (kg)</label>
                        <input 
                            type="number" 
                            value={formData.weight} 
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            placeholder="0.0"
                        />
                    </div>
                    <div className="form-group text-input">
                        <label><Ruler size={14}/> Height (cm)</label>
                        <input 
                            type="number" 
                            value={formData.height} 
                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                            placeholder="0"
                        />
                    </div>
                    <div className="form-group text-input">
                        <label><Calendar size={14}/> Age</label>
                        <input 
                            type="number" 
                            value={formData.age} 
                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                            placeholder="0"
                        />
                    </div>
                    <div className="form-group">
                        <label><UserIcon size={14}/> Gender</label>
                        <select 
                            value={formData.gender} 
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            style={{ width: '100%', background: '#080c10', border: '1px solid var(--border)', padding: '14px 16px', borderRadius: '12px', color: 'white', outline: 'none' }}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label><Shield size={14}/> Security (Change Password)</label>
                        <input 
                            type="password" 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Leave empty to keep current"
                        />
                    </div>
                </div>
                <button type="submit" className="save-btn">
                    <Save size={20} /> Update Fit Profile
                </button>
            </form>
        </div>
      ) : (
        <div className="profile-details-grid animate-fade-in">
            <div className="detail-section">
                <div className="section-label">ACCOUNT INSIGHTS</div>
                <div className="workout-grid">
                    <SettingsItem icon={<Shield size={20} />} title="Security Clear" desc="Your account is protected with JWT encryption" />
                    <SettingsItem icon={<Bell size={20} />} title="Smart Alerts" desc="Notifications are synced with your workout schedule" />
                    <SettingsItem icon={<Trophy size={20} />} title="Achievement Level" desc="You are currently at Level 14 in Strength goals" />
                </div>
            </div>
        </div>
      )}

      <style>{`
        .profile-page { max-width: 1200px; margin: 0 auto; }
        
        .glitch-text { font-family: 'Bebas Neue'; font-size: 54px; letter-spacing: 4px; color: var(--accent-green); text-shadow: 0 0 20px rgba(0, 255, 135, 0.4); }
        
        .premium-btn {
            display: flex; align-items: center; gap: 8px; padding: 10px 20px;
            border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.03); color: white; cursor: pointer;
            transition: all 0.3s; font-weight: 600; font-size: 14px;
        }
        .premium-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
        .premium-btn.edit { border-color: var(--accent-green); color: var(--accent-green); }
        .premium-btn.logout { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
        .premium-btn.cancel { border-color: #94a3b8; color: #94a3b8; }

        .profile-hero-card {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid var(--border); border-radius: 24px; padding: 40px; margin-bottom: 40px;
            position: relative; overflow: hidden;
        }
        .profile-hero-card::before {
            content: ''; position: absolute; top: -50%; right: -20%; width: 500px; height: 500px;
            background: radial-gradient(circle, rgba(0, 255, 135, 0.05) 0%, transparent 70%);
        }
        
        .hero-content { display: flex; align-items: center; gap: 40px; flex-wrap: wrap; }
        
        .avatar-wrapper { position: relative; }
        .avatar-main {
            width: 130px; height: 130px; border-radius: 40px; background: #080c10;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Bebas Neue'; font-size: 54px; color: var(--accent-green);
            border: 2px solid var(--accent-green); position: relative; z-index: 1;
        }
        .avatar-ring {
            position: absolute; inset: -10px; border: 1px solid rgba(0, 255, 135, 0.2);
            border-radius: 45px; animation: spin 10s linear infinite;
        }
        @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
        
        .user-name { font-family: 'Bebas Neue'; font-size: 42px; letter-spacing: 2px; margin-bottom: 8px; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-right: 8px; }
        .badge.eco { background: rgba(0, 255, 135, 0.1); color: var(--accent-green); border: 1px solid rgba(0, 255, 135, 0.2); }
        .badge.pro { background: rgba(0, 212, 255, 0.1); color: var(--accent-cyan); border: 1px solid rgba(0, 212, 255, 0.2); }

        .quick-metrics { display: flex; gap: 20px; margin-left: auto; }
        .metric-box {
            background: rgba(255,255,255,0.02); border: 1px solid var(--border);
            padding: 15px 25px; border-radius: 18px; text-align: center; min-width: 110px;
        }
        .metric-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .metric-value { font-family: 'Bebas Neue'; font-size: 26px; color: white; line-height: 1; }
        .metric-unit { font-size: 12px; color: var(--text-muted); margin-left: 4px; }

        .modern-form { background: var(--bg-card); padding: 30px; border-radius: 20px; border: 1px solid var(--border); }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-bottom: 30px; }
        .form-group label { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 13px; margin-bottom: 10px; font-weight: 500; }
        .form-group input {
            width: 100%; background: #080c10; border: 1px solid var(--border);
            padding: 14px 16px; border-radius: 12px; color: white; transition: 0.3s;
        }
        .form-group input:focus { border-color: var(--accent-green); outline: none; box-shadow: 0 0 20px rgba(0, 255, 135, 0.1); }
        
        .save-btn {
            width: 100%; background: var(--accent-green); color: #000; border: none;
            padding: 16px; border-radius: 12px; font-weight: 800; display: flex;
            align-items: center; justify-content: center; gap: 10px; cursor: pointer;
            transition: 0.3s; font-size: 16px;
        }
        .save-btn:hover { transform: scale(1.01); box-shadow: 0 10px 30px rgba(0, 255, 135, 0.2); }

        .toast-message { padding: 15px; border-radius: 12px; margin-bottom: 25px; font-weight: 600; text-align: center; }
        .toast-message.success { background: rgba(0, 255, 135, 0.1); color: var(--accent-green); border: 1px solid var(--accent-green); }
        .toast-message.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; }

        .animate-fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
};

const MetricBox = ({ icon, label, value, unit }) => (
    <div className="metric-box">
        <div className="metric-label">{icon} {label}</div>
        <div className="metric-value">{value}<span className="metric-unit">{unit}</span></div>
    </div>
);

const SettingsItem = ({ icon, title, desc }) => (
  <div className="workout-card" style={{ marginBottom: '15px' }}>
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div className="wc-icon" style={{ background: 'rgba(0, 255, 135, 0.1)', color: 'var(--accent-green)', padding: '12px', borderRadius: '14px' }}>{icon}</div>
      <div>
        <div className="wc-title" style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>{title}</div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </div>
  </div>
);

export default Profile;
