import React from 'react';
import { Camera, Settings, Shield, Bell, Trophy } from 'lucide-react';

const Profile = () => {
  return (
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>Account Settings</h1>
          <p>Manage your profile and preferences</p>
        </div>
        <div className="topbar-right">
          <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Settings size={18} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="progress-section" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ position: 'relative' }}>
            <div className="avatar" style={{ width: '120px', height: '120px', fontSize: '42px', boxShadow: '0 0 40px rgba(0,255,135,0.2)' }}>
              AL
            </div>
            <button style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#fff', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
              <Camera size={16} color="#000" />
            </button>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '2px' }}>ALI AHMED</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Member since April 2024 &nbsp;|&nbsp; Pro Athlete Plan</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="section-tag" style={{ border: '1px solid var(--accent-green)', color: 'var(--accent-green)' }}>Verified</span>
              <span className="section-tag">Week 4 Streak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-label">Personal Best Benchmarks</div>
      <div className="stats-grid">
        <BenchmarkCard icon={<Trophy size={20} />} title="Deadlift" value="185kg" date="Set on 12 April" color="var(--accent-purple)" />
        <BenchmarkCard icon={<Trophy size={20} />} title="Bench Press" value="120kg" date="Set on 05 April" color="var(--accent-cyan)" />
        <BenchmarkCard icon={<Trophy size={20} />} title="Squat" value="145kg" date="Set on 28 March" color="var(--accent-green)" />
        <BenchmarkCard icon={<Trophy size={20} />} title="5K Run" value="22:15" date="Set on 15 March" color="var(--accent-orange)" />
      </div>

      <div className="section-label">General Settings</div>
      <div className="workout-grid">
        <SettingsItem icon={<Shield size={20} />} title="Privacy & Security" desc="Manage data sharing and account security" />
        <SettingsItem icon={<Bell size={20} />} title="Notifications" desc="Configure alert preferences for workouts" />
      </div>
    </main>
  );
};

const BenchmarkCard = ({ icon, title, value, date, color }) => (
  <div className="stat-card" style={{ '--accent-color-solid': color }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
       <div className="stat-label">{title}</div>
       {icon}
    </div>
    <div className="stat-value" style={{ fontSize: '42px' }}>{value}</div>
    <div className="stat-unit">{date}</div>
  </div>
);

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
