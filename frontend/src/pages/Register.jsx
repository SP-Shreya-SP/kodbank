import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
    });
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
            await axios.post('/api/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-container floating">
            <h1 className="gradient-text">Register</h1>
            <p>Join Kodbank for secure banking</p>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                <div className="form-group">
                    <label>Username</label>
                    <input name="username" placeholder="Choose a unique username" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input name="phone" placeholder="Enter your mobile number" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Create a strong password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn primary-btn" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register Now'}
                </button>
            </form>
            <p className="footer-text">
                Already have an account? <Link to="/login" className="link">Login</Link>
            </p>
        </div>
    );
};

export default Register;
