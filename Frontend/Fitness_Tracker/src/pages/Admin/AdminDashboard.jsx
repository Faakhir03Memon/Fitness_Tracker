import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Users, Activity, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalWorkouts: 0 });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <ShieldCheck color="#6366f1" size={28} />
                    <span>FitTrack Admin</span>
                </div>
                <nav className="admin-nav">
                    <a href="#" className="active"><Activity size={20} /> Dashboard</a>
                    <a href="#"><Users size={20} /> Users</a>
                </nav>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Welcome, Admin {user?.email}</h1>
                </header>

                <div className="admin-stats-grid">
                    <div className="stat-box">
                        <h3>Total Workouts Across App</h3>
                        <p className="stat-value">1,248</p>
                    </div>
                    <div className="stat-box">
                        <h3>Daily Active Users</h3>
                        <p className="stat-value">84</p>
                    </div>
                </div>

                <div className="admin-table-container">
                    <h2>System Audit Logs</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Action</th>
                                <th>Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{new Date().toLocaleString()}</td>
                                <td>Admin Login Successful</td>
                                <td>{user?.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>

            <style>{`
                .admin-layout { display: flex; min-height: 100vh; background: #0f172a; color: white; }
                .admin-sidebar { width: 260px; background: #1e293b; border-right: 1px solid #334155; padding: 25px; display: flex; flex-direction: column; }
                .admin-logo { display: flex; align-items: center; gap: 10px; font-size: 1.25rem; font-weight: 700; margin-bottom: 40px; }
                .admin-nav { flex: 1; }
                .admin-nav a { display: flex; align-items: center; gap: 12px; padding: 12px; color: #94a3b8; text-decoration: none; border-radius: 8px; margin-bottom: 5px; transition: 0.2s; }
                .admin-nav a.active { background: #312e81; color: white; }
                .admin-nav a:hover:not(.active) { background: #334155; color: white; }
                
                .logout-btn { display: flex; align-items: center; gap: 12px; padding: 12px; background: #450a0a; color: #f87171; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; transition: 0.2s; }
                .logout-btn:hover { background: #7f1d1d; }

                .admin-main { flex: 1; padding: 40px; overflow-y: auto; }
                .admin-header { margin-bottom: 40px; }
                .admin-header h1 { font-size: 1.8rem; }

                .admin-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 25px; margin-bottom: 40px; }
                .stat-box { background: #1e293b; border: 1px solid #334155; padding: 25px; border-radius: 12px; }
                .stat-box h3 { font-size: 0.9rem; color: #94a3b8; margin-bottom: 10px; }
                .stat-value { font-size: 2rem; font-weight: 700; color: #6366f1; }

                .admin-table-container { background: #1e293b; border: 1px solid #334155; padding: 25px; border-radius: 12px; }
                .admin-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .admin-table th { text-align: left; padding: 12px; color: #94a3b8; border-bottom: 1px solid #334155; font-size: 0.85rem; }
                .admin-table td { padding: 12px; border-bottom: 1px solid #334155; font-size: 0.9rem; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
