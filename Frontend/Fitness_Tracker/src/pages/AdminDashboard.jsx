import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Shield, Trash2, Ban, Eye, CheckCircle, XCircle, BarChart, ExternalLink, Mail, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserLogs, setSelectedUserLogs] = useState(null);

    const authConfig = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', authConfig);
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleToggleBan = async (userId, currentlyBanned) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, {
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
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, authConfig);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const viewLogs = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/users/${userId}/logs`, authConfig);
            setSelectedUserLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="main">
            <div className="topbar">
                <div className="greeting">
                    <h1 style={{fontFamily: 'Bebas Neue', fontSize: '48px', letterSpacing: '3px'}}>COMMAND CENTER</h1>
                    <p>Logged in as: <strong style={{color: 'var(--accent-green)'}}>Mymn SaaB</strong> (Super Admin)</p>
                </div>
                <div className="topbar-right">
                    <div className="streak-badge" style={{borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)'}}>
                         <Shield size={16} style={{marginRight: '8px'}}/> System Integrity: 100%
                    </div>
                </div>
            </div>

            <div className="section-label"><Users size={16} style={{marginRight: '8px'}}/> USER MANAGEMENT</div>
            
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email Address</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Establishing secure connection to database...</td></tr>
                        ) : users.map(u => (
                            <tr key={u._id} className={u.isBanned ? 'row-banned' : ''}>
                                <td>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <div className="avatar small">{u.name.charAt(0)}</div>
                                        <span style={{fontWeight: '700'}}>{u.name}</span>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`status-pill ${u.isBanned ? 'banned' : 'active'}`}>
                                        {u.isBanned ? <XCircle size={12}/> : <CheckCircle size={12}/>}
                                        {u.status.toUpperCase()}
                                    </span>
                                </td>
                                <td><span style={{opacity: 0.6, fontSize: '12px', fontWeight: 'bold'}}>{u.role.toUpperCase()}</span></td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="action-btn view" title="View Logs" onClick={() => viewLogs(u._id)}><BarChart size={16}/></button>
                                        <button className="action-btn ban" title={u.isBanned ? "Unban" : "Ban"} onClick={() => handleToggleBan(u._id, u.isBanned)}>
                                            <Ban size={16} />
                                        </button>
                                        <button className="action-btn delete" title="Delete User" onClick={() => handleDeleteUser(u._id)}><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUserLogs && (
                <div className="modal-overlay">
                    <div className="modal logs-modal" style={{maxWidth: '800px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '25px'}}>
                            <div className="section-label">USER ACTIVITY LOGS</div>
                            <button className="btn-cancel" style={{width: 'auto', padding: '5px 15px'}} onClick={() => setSelectedUserLogs(null)}>Close</button>
                        </div>
                        <div className="logs-grid">
                            <div className="log-section">
                                <h4>Recent Workouts</h4>
                                {selectedUserLogs.workouts.length > 0 ? selectedUserLogs.workouts.map((w, i) => (
                                    <div key={i} className="log-item">{w.type} | {w.duration} min</div>
                                )) : <p className="empty">No workouts found</p>}
                            </div>
                            <div className="log-section">
                                <h4>Recent Meals</h4>
                                {selectedUserLogs.meals.length > 0 ? selectedUserLogs.meals.map((m, i) => (
                                    <div key={i} className="log-item">{m.foodName} | {m.calories} kcal</div>
                                )) : <p className="empty">No meals found</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .admin-table-container { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { text-align: left; padding: 20px; background: rgba(255,255,255,0.02); color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
                .admin-table td { padding: 20px; border-top: 1px solid var(--border); font-size: 14px; }
                .row-banned { background: rgba(239, 68, 68, 0.02); }
                
                .status-pill { display: flex; align-items: center; gap: 6px; width: fit-content; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; }
                .status-pill.active { background: rgba(0, 255, 137, 0.1); color: var(--accent-green); }
                .status-pill.banned { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                
                .admin-actions { display: flex; gap: 10px; }
                .action-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: #080c10; color: var(--text-muted); cursor: pointer; transition: 0.3s; }
                .action-btn:hover { border-color: rgba(255,255,255,0.2); color: white; }
                .action-btn.ban:hover { color: #f59e0b; border-color: #f59e0b33; }
                .action-btn.delete:hover { color: #ef4444; border-color: #ef444433; }
                .action-btn.view:hover { color: var(--accent-cyan); border-color: #00d4ff33; }
                
                .logs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                .log-section h4 { font-family: 'Bebas Neue'; letter-spacing: 1px; margin-bottom: 15px; color: var(--accent-green); }
                .log-item { background: #080c10; padding: 12px; border-radius: 10px; margin-bottom: 8px; font-size: 13px; border: 1px solid var(--border); }
                .empty { font-size: 12px; color: var(--text-muted); font-style: italic; }
            `}</style>
        </main>
    );
};

export default AdminDashboard;
