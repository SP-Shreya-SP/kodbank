import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
    Wallet,
    History,
    PlusCircle,
    MinusCircle,
    User,
    LogOut,
    CreditCard,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
        fetchTransactions();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const res = await axios.get('/api/user-info');
            setUserInfo(res.data);
        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('/api/transactions');
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const checkBalance = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/balance');
            setBalance(res.data.balance);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#ec4899']
            });
            fetchTransactions();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (type) => {
        if (!amount || amount <= 0) return;
        setLoading(true);
        setError('');
        try {
            const endpoint = type === 'deposit' ? '/api/deposit' : '/api/withdraw';
            await axios.post(endpoint, { amount: parseFloat(amount) });
            setAmount('');
            setActiveTab('home');
            checkBalance();
            fetchTransactions();
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await axios.post('/api/logout');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="stat-card floating" style={{ animationDuration: '4s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Total Balance</p>
                                <h2 className="balance-amount">
                                    {balance !== null ? `$${parseFloat(balance).toLocaleString()}` : '$ ••••••'}
                                </h2>
                            </div>
                            <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '1rem', boxShadow: '0 0 20px var(--primary-glow)' }}>
                                <Wallet size={32} color="white" />
                            </div>
                        </div>
                        <button
                            onClick={checkBalance}
                            className="btn primary-btn"
                            style={{ padding: '1.25rem', marginTop: '2rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Verify & Check Balance'}
                        </button>
                    </div>
                );
            case 'deposit':
                return (
                    <div className="stat-card">
                        <h2 className="gradient-text" style={{ fontSize: '1.75rem' }}>Deposit Funds</h2>
                        <p style={{ marginBottom: '2rem' }}>Instantly add funds to your digital wallet</p>
                        {error && <p className="error-text">{error}</p>}
                        <div className="form-group">
                            <label>Amount (USD)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <button onClick={() => handleAction('deposit')} className="btn primary-btn" disabled={loading}>
                            <PlusCircle size={20} />
                            {loading ? 'Adding...' : 'Confirm Deposit'}
                        </button>
                    </div>
                );
            case 'withdraw':
                return (
                    <div className="stat-card">
                        <h2 className="gradient-text" style={{ fontSize: '1.75rem' }}>Withdraw Cash</h2>
                        <p style={{ marginBottom: '2rem' }}>Securely deduct funds from your account</p>
                        {error && <p className="error-text">{error}</p>}
                        <div className="form-group">
                            <label>Amount (USD)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <button onClick={() => handleAction('withdraw')} className="btn link-btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} disabled={loading}>
                            <MinusCircle size={20} />
                            {loading ? 'Processing...' : 'Confirm Withdrawal'}
                        </button>
                    </div>
                );
            case 'transactions':
                return (
                    <div className="stat-card">
                        <h2 className="gradient-text" style={{ fontSize: '1.75rem' }}>Transaction Statement</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Activity</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td>
                                                <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {tx.type === 'Withdraw' ? <TrendingDown size={14} color="var(--danger)" /> : <TrendingUp size={14} color="var(--success)" />}
                                                    {tx.type === 'Registration' ? 'Account Opening' :
                                                        tx.type === 'Deposit' ? 'Digital Deposit' :
                                                            tx.type === 'Withdraw' ? 'Cash Withdrawal' : 'Balance Inquiry'}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    color: tx.type === 'Withdraw' ? 'var(--danger)' : tx.amount > 0 ? 'var(--success)' : 'var(--text-muted)',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '800',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {tx.type === 'Withdraw' ? 'DEBIT' : tx.amount > 0 ? 'CREDIT' : 'SESSION'}
                                                </span>
                                            </td>
                                            <td style={{
                                                fontWeight: '800',
                                                color: tx.type === 'Withdraw' ? 'var(--danger)' : tx.amount > 0 ? 'var(--success)' : 'inherit'
                                            }}>
                                                {tx.amount > 0 ? (tx.type === 'Withdraw' ? `-$${parseFloat(tx.amount).toLocaleString()}` : `+$${parseFloat(tx.amount).toLocaleString()}`) : '—'}
                                            </td>
                                            <td>
                                                <span className={`badge ${tx.status === 'Success' ? 'badge-success' : 'badge-primary'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {new Date(tx.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="stat-card">
                        <div className="bank-card floating">
                            <div className="card-chip"></div>
                            <div className="card-logo">Kodbank Gold</div>
                            <div className="card-number">•••• •••• •••• {userInfo?.uid?.toString().padStart(4, '0')}</div>
                            <div className="card-details">
                                <div className="card-holder">
                                    <div className="label">Account Holder</div>
                                    <div className="value">{userInfo?.username}</div>
                                </div>
                                <div className="card-expiry">
                                    <div className="label">Valid Thru</div>
                                    <div className="value">12/29</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
                            <InfoItem icon={<User size={16} />} label="Username" value={userInfo?.username} />
                            <InfoItem icon={<CreditCard size={16} />} label="Tier" value={userInfo?.role} />
                            <div style={{ gridColumn: 'span 2' }}>
                                <InfoItem icon={<Activity size={16} />} label="Email Registered" value={userInfo?.email} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <InfoItem icon={<PlusCircle size={16} />} label="Mobile Number" value={userInfo?.phone} />
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="dashboard-grid">
            <aside className="sidebar">
                <SidebarItem icon={<Wallet size={20} />} label="Overview" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <SidebarItem icon={<PlusCircle size={20} />} label="Add Money" active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')} />
                <SidebarItem icon={<MinusCircle size={20} />} label="Withdraw" active={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')} />
                <SidebarItem icon={<History size={20} />} label="Statement" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
                <SidebarItem icon={<User size={20} />} label="Account Info" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                    <SidebarItem icon={<LogOut size={20} />} label="Logout" danger onClick={handleLogout} />
                </div>
            </aside>

            <main>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{userInfo?.username}'s Vault</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Secured by Kodbank Quantum Encryption</p>
                    </div>
                </header>
                {renderContent()}
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick, danger }) => (
    <div
        className={`sidebar-item ${active ? 'active' : ''}`}
        onClick={onClick}
        style={{ color: danger ? '#f87171' : '' }}
    >
        {icon}
        <span>{label}</span>
        {active && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
    </div>
);

const InfoItem = ({ icon, label, value }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '1.25rem',
        border: '1px solid var(--glass-border)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--primary)' }}>{icon}</div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
        </div>
        <span style={{ fontWeight: '600', color: 'white' }}>{value}</span>
    </div>
);

export default Dashboard;
