import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="main-container">
            <Sidebar />
            {children}
        </div>
    );
};

export default Layout;
