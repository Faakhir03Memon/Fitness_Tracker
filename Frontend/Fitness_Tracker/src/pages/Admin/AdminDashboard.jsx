import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../api/config';
import { 
    ShieldCheck, Users, Activity, LogOut, Trash2, Ban, 
    Eye, CheckCircle, XCircle, BarChart, Search, Globe, Terminal, Mail 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'users'
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserLogs, setSelectedUserLogs] = useState(null);

    const authConfig = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    useEffect(() => {
        if (view === 'users') {
            fetchUsers();
        }
    }, [view]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/users`, authConfig);
            setUsersList(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleToggleBan = async (userId, currentlyBanned) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
                isBanned: !currentlyBanned,
                status: !currentlyBanned ? 'banned' : 'active'
            }, authConfig);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user and all their data?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, authConfig);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const viewLogs = async (u) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/users/${u._id}/logs`, authConfig);
            setSelectedUserLogs({ ...res.data, profile: u });
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <ShieldCheck color="#00ff89" size={28} />
                    <span style={{color: 'white', fontFamily: 'Bebas Neue', letterSpacing: '1px'}}>FitTrack Admin</span>
                </div>
                <nav className="admin-nav">
                    <button 
                        onClick={() => setView('dashboard')} 
                        className={view === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
                    >
                        <Activity size={20} /> Dashboard
                    </button>
                    <button 
                        onClick={() => setView('users')} 
                        className={view === 'users' ? 'nav-btn active' : 'nav-btn'}
                    >
                        <Users size={20} /> Users
                    </button>
                </nav>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h1 style={{fontFamily: 'Bebas Neue', fontSize: '32px', letterSpacing: '2px'}}>Welcome, Mymn SaaB</h1>
                    <p style={{color: '#94a3b8', fontSize: '13px'}}>System Status: <span style={{color: '#00ff89'}}>Online & Secure</span></p>
                </header>

                {view === 'dashboard' ? (
                    <div className="dashboard-view animate-fade-in">
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
                                        <td>Admin Session Initialized</td>
                                        <td>Mymn SaaB</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="users-view animate-fade-in">
                         <div className="admin-table-container" style={{background: 'rgba(30, 41, 59, 0.5)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 0 20px 0'}}>
                                <h2 style={{margin: 0}}>User Directory</h2>
                                <button onClick={fetchUsers} className="refresh-btn">Refresh List</button>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Provider</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>Loading secure user data...</td></tr>
                                    ) : usersList.map(u => (
                                        <tr key={u._id} className={u.isBanned ? 'row-banned' : ''}>
                                            <td>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                    <div className="admin-avatar">{u.name[0]}</div>
                                                    <span>{u.name}</span>
                                                </div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`status-tag ${u.isBanned ? 'banned' : 'active'}`}>
                                                    {u.isBanned ? 'BANNED' : 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="provider-info">
                                                    {u.provider === 'google' && <Search size={12}/>}
                                                    {u.provider === 'facebook' && <Globe size={12}/>}
                                                    {u.provider === 'github' && <Terminal size={12}/>}
                                                    {u.provider === 'email' && <Mail size={12}/>}
                                                    {u.provider?.toUpperCase()}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button onClick={() => viewLogs(u._id)} className="icon-btn" title="View Logs"><BarChart size={16}/></button>
                                                    <button onClick={() => handleToggleBan(u._id, u.isBanned)} className="icon-btn ban-btn" title="Ban User"><Ban size={16}/></button>
                                                    <button onClick={() => handleDeleteUser(u._id)} className="icon-btn delete-btn" title="Kick User"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {selectedUserLogs && (
                    <div className="admin-modal-overlay">
                        <div className="admin-modal glassmorphism">
                            <div className="modal-header">
                                <h3>User Activity Profile</h3>
                                <button onClick={() => setSelectedUserLogs(null)} className="close-btn">×</button>
                            </div>
                            <div className="logs-content" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                <div className="log-col">
                                    <h4>Workouts</h4>
                                    {selectedUserLogs.workouts.length > 0 ? selectedUserLogs.workouts.map((w,i)=><div key={i} className="log-item">{w.type} - {w.duration} min</div>) : <p className="empty-text">No workouts</p>}
                                </div>
                                <div className="log-col">
                                    <h4>Meals</h4>
                                    {selectedUserLogs.meals.length > 0 ? selectedUserLogs.meals.map((m,i)=><div key={i} className="log-item">{m.foodName} - {m.calories} kcal</div>) : <p className="empty-text">No meals</p>}
                                </div>
                                <div className="log-col">
                                    <h4>Daily Stats</h4>
                                    {selectedUserLogs.stats && selectedUserLogs.stats.length > 0 ? selectedUserLogs.stats.map((s,i)=>(
                                        <div key={i} className="log-item" style={{borderColor: 'rgba(0, 255, 137, 0.2)'}}>
                                            <div style={{fontSize: '10px', color: '#00ff89', marginBottom: '4px'}}>{new Date(s.date).toLocaleDateString()}</div>
                                            <div>{s.steps.toLocaleString()} steps | {s.water}L water</div>
                                        </div>
                                    )) : <p className="empty-text">No stats</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                .admin-layout { display: flex; min-height: 100vh; background: #070b14; color: white; font-family: 'DM Sans', sans-serif; }
                .admin-sidebar { width: 260px; background: #0d111b; border-right: 1px solid #1e293b; padding: 30px 20px; display: flex; flex-direction: column; }
                .admin-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 50px; padding: 0 10px; }
                .admin-nav { flex: 1; }
                .nav-btn { width: 100%; display: flex; align-items: center; gap: 15px; padding: 14px 20px; background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; border-radius: 12px; transition: 0.3s; margin-bottom: 8px; text-align: left; }
                .nav-btn:hover { background: rgba(0, 255, 137, 0.05); color: #00ff89; }
                .nav-btn.active { background: #00ff89; color: black; }
                
                .logout-btn { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; border-radius: 12px; cursor: pointer; font-weight: 700; width: 100%; transition: 0.3s; margin-top: 20px; }
                .logout-btn:hover { background: #ef4444; color: white; }

                .admin-main { flex: 1; padding: 40px; overflow-y: auto; }
                .admin-header { margin-bottom: 40px; border-bottom: 1px solid #1e293b; padding-bottom: 20px; }

                .admin-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-bottom: 40px; }
                .stat-box { background: #0d111b; border: 1px solid #1e293b; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                .stat-box h3 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 15px; }
                .stat-value { font-size: 2.5rem; font-weight: 800; color: #00ff89; font-family: 'Bebas Neue'; }

                .admin-table-container { background: #0d111b; border: 1px solid #1e293b; padding: 30px; border-radius: 24px; }
                .admin-table-container h2 { font-family: 'Bebas Neue'; letter-spacing: 1px; font-size: 24px; margin-bottom: 25px; color: #94a3b8; }
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { text-align: left; padding: 15px; color: #64748b; border-bottom: 1px solid #1e293b; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; }
                .admin-table td { padding: 15px; border-bottom: 1px solid #1e293b; font-size: 14px; }
                .row-banned { opacity: 0.5; background: rgba(239, 68, 68, 0.02); }

                .admin-avatar { width: 32px; height: 32px; background: #1e293b; color: #00ff89; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 1px solid #00ff8933; }
                .status-tag { padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; }
                .status-tag.active { background: rgba(0, 255, 137, 0.1); color: #00ff89; }
                .status-tag.banned { background: rgba(239, 68, 68, 0.1); color: #f87171; }
                
                .provider-info { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; color: #94a3b8; }
                .admin-table-actions { display: flex; gap: 8px; }
                .icon-btn { width: 32px; height: 32px; border-radius: 8px; background: #070b14; border: 1px solid #1e293b; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .icon-btn:hover { color: white; border-color: white; }
                .icon-btn.ban-btn:hover { color: #f59e0b; border-color: #f59e0b; }
                .icon-btn.delete-btn:hover { color: #f87171; border-color: #f87171; }

                .refresh-btn { background: #1e293b; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; }
                .refresh-btn:hover { background: #334155; }

                .admin-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .admin-modal { background: #0d111b; border: 1px solid #1e293b; width: 100%; max-width: 600px; padding: 40px; border-radius: 32px; }
                .modal-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .modal-header h3 { font-family: 'Bebas Neue'; font-size: 24px; color: #00ff89; }
                .close-btn { background: none; border: none; color: white; font-size: 28px; cursor: pointer; }
                .logs-content { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                .log-col h4 { font-size: 12px; color: #64748b; margin-bottom: 15px; text-transform: uppercase; }
                .log-item { background: #070b14; padding: 12px; border-radius: 12px; margin-bottom: 8px; font-size: 13px; border: 1px solid #1e293b; }
                .empty-text { font-size: 12px; color: #475569; font-style: italic; }

                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
