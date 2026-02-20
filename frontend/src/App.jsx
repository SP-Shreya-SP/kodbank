import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav className="navbar">
                    <Link to="/" className="logo" style={{ textDecoration: 'none' }}>Kodbank</Link>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Login</Link>
                        <Link to="/register" className="btn primary-btn" style={{ padding: '0.6rem 1.5rem', width: 'auto', fontSize: '0.9rem' }}>Open Account</Link>
                    </div>
                </nav>
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
