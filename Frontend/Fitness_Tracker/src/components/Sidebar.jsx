import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, LineChart, Utensils, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();

    return (
        <aside className="sidebar">
            <div className="logo">FITTRACK</div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Dashboard">
                    <LayoutDashboard className="nav-icon" />
                </NavLink>
                <NavLink to="/workouts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Workouts">
                    <Dumbbell className="nav-icon" />
                </NavLink>
                <NavLink to="/progress" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Progress">
                    <LineChart className="nav-icon" />
                </NavLink>
                <NavLink to="/nutrition" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Nutrition">
                    <Utensils className="nav-icon" />
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Profile">
                    <User className="nav-icon" />
                </NavLink>
            </nav>

            <div style={{ marginTop: 'auto' }}>
                <button 
                    onClick={logout} 
                    className="nav-item" 
                    title="Logout" 
                    style={{ background: 'transparent', border: 'none' }}
                >
                    <LogOut className="nav-icon" style={{ color: '#ef4444' }} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
