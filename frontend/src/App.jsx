import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
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
                        <a
                            href="https://mychat-app-three.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#fbbf24',
                                textDecoration: 'none',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.4rem 0.8rem',
                                background: 'rgba(251, 191, 36, 0.1)',
                                borderRadius: '0.75rem',
                                border: '1px solid rgba(251, 191, 36, 0.2)'
                            }}
                        >
                            <Sparkles size={16} />
                            Chat AI
                        </a>
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
