import React, { useState } from 'react';
import { Camera, Settings, Shield, Bell, Trophy, LogOut, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    weight: user?.weight || '',
    height: user?.height || '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', formData, config);
      login(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>Account Settings</h1>
          <p>Manage your profile and preferences</p>
        </div>
        <div className="topbar-right" style={{ display: 'flex', gap: '12px' }}>
          {!isEditing ? (
            <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Settings size={18} /> Edit Profile
            </button>
          ) : (
            <button className="btn-primary" onClick={() => setIsEditing(false)} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#334155' }}>
              <X size={18} /> Cancel
            </button>
          )}
          <button className="btn-primary" onClick={logout} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#ef4444' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {message.text && (
        <div style={{ 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          background: message.type === 'success' ? '#064e3b' : '#450a0a',
          color: message.type === 'success' ? '#10b981' : '#f87171',
          border: `1px solid ${message.type === 'success' ? '#065f46' : '#7f1d1d'}`
        }}>
          {message.text}
        </div>
      )}

      <div className="progress-section" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div className="avatar" style={{ width: '120px', height: '120px', fontSize: '42px', boxShadow: '0 0 40px rgba(0,255,135,0.2)' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#fff', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
              <Camera size={16} color="#000" />
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleUpdate} style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '5px', fontSize: '0.8rem' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '6px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '5px', fontSize: '0.8rem' }}>Email</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '5px', fontSize: '0.8rem' }}>Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight} 
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '6px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '5px', fontSize: '0.8rem' }}>Height (cm)</label>
                  <input 
                    type="number" 
                    value={formData.height} 
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '5px', fontSize: '0.8rem' }}>New Password (Leave blank to keep current)</label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '6px' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Save size={18} /> Save Changes
              </button>
            </form>
          ) : (
            <div>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '2px' }}>{user?.name?.toUpperCase()}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>{user?.email} &nbsp;|&nbsp; {user?.role === 'admin' ? 'Administrator' : 'Fitness Enthusiast'}</p>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ background: '#312e81', padding: '5px 12px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Weight</span>
                    <span style={{ fontWeight: 'bold' }}>{user?.weight || '--'} kg</span>
                </div>
                <div style={{ background: '#312e81', padding: '5px 12px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Height</span>
                    <span style={{ fontWeight: 'bold' }}>{user?.height || '--'} cm</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="section-tag" style={{ border: '1px solid var(--accent-green)', color: 'var(--accent-green)' }}>Verified</span>
                <span className="section-tag">Active Member</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section-label">General Settings</div>
      <div className="workout-grid">
        <SettingsItem icon={<Shield size={20} />} title="Privacy & Security" desc="Manage data sharing and account security" />
        <SettingsItem icon={<Bell size={20} />} title="Notifications" desc="Configure alert preferences for workouts" />
      </div>

      <style>{`
        input:focus { outline: none; border-color: var(--accent-green) !important; }
      `}</style>
    </main>
  );
};

const SettingsItem = ({ icon, title, desc }) => (
  <div className="workout-card" style={{ cursor: 'pointer' }}>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div className="wc-icon">{icon}</div>
      <div>
        <div className="wc-title" style={{ marginBottom: '0' }}>{title}</div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </div>
  </div>
);

export default Profile;
