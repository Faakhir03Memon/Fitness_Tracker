import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Activity, Salad, User } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: <LayoutDashboard className="nav-icon" />, title: 'Dashboard' },
    { path: '/workouts', icon: <Dumbbell className="nav-icon" />, title: 'Workouts' },
    { path: '/progress', icon: <Activity className="nav-icon" />, title: 'Progress' },
    { path: '/nutrition', icon: <Salad className="nav-icon" />, title: 'Nutrition' },
    { path: '/profile', icon: <User className="nav-icon" />, title: 'Profile' },
  ];

  return (
    <nav className="sidebar">
      <div className="logo">FIT</div>
      
      {navItems.map((item, index) => (
        <NavLink 
          key={index}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          title={item.title}
          style={item.title === 'Profile' ? { marginTop: 'auto' } : {}}
        >
          {item.icon}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;
