import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/login', formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-container floating" style={{ maxWidth: '450px', margin: '0 auto' }}>
            <h1 className="gradient-text">Welcome Back</h1>
            <p>Securely log into your Kodbank account</p>

            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                <div className="form-group">
                    <label>Username</label>
                    <input name="username" placeholder="Enter your username" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn primary-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Login to Account'}
                </button>
            </form>

            <p className="footer-text">
                New to Kodbank? <Link to="/register" className="link">Create an account</Link>
            </p>
        </div>
    );
};

export default Login;
