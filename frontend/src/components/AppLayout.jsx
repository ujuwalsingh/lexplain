// In frontend/src/components/AppLayout.jsx
import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

function AppLayout() {
  return (
    <div className="app-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">LEXPLAIN</Link>
        <ul className="nav-links">
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'app-nav-active' : ''}>Dashboard</NavLink></li>
          <li><NavLink to="/upload" className={({ isActive }) => isActive ? 'app-nav-active' : ''}>Upload</NavLink></li>
          <li><NavLink to="/summary" className={({ isActive }) => isActive ? 'app-nav-active' : ''}>Summary</NavLink></li>
          <li><NavLink to="/qa" className={({ isActive }) => isActive ? 'app-nav-active' : ''}>Q&A</NavLink></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default AppLayout;