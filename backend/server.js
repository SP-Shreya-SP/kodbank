require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : null,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper to check token middleware
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log('Auth Failed: No token found in cookies');
        return res.status(401).json({ message: 'Access Denied: No Token' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = verified;

        if (!req.user.uid) {
            console.error('Auth Failed: Token missing uid claim');
            return res.status(401).json({ message: 'Invalid Token Payload' });
        }

        const [rows] = await pool.execute('SELECT * FROM UserToken WHERE token = ?', [token]);
        if (rows.length === 0) {
            console.log('Auth Failed: Token not found in UserToken table');
            return res.status(401).json({ message: 'Invalid or Expired Token' });
        }

        next();
    } catch (err) {
        console.error('Auth Failed: JWT verify error:', err.message);
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// --- API Endpoints ---

// 1. Register
app.post('/api/register', async (req, res) => {
    const { username, email, password, phone } = req.body;
    console.log('Registering user:', username);
    const role = 'Customer';
    const initialBalance = 100000;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO KodUser (username, email, password, balance, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, initialBalance, phone, role]
        );

        const userId = result.insertId;
        console.log('User created with UID:', userId);

        // Record initial deposit transaction
        await pool.execute(
            'INSERT INTO Transactions (uid, type, amount, status) VALUES (?, ?, ?, ?)',
            [userId, 'Registration', initialBalance, 'Success']
        );

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username);

    try {
        const [users] = await pool.execute('SELECT * FROM KodUser WHERE username = ?', [username]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = users[0];
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        if (!user.uid) {
            console.error('Database Error: uid is missing for user', username);
            return res.status(500).json({ message: 'Account configuration error' });
        }

        const token = jwt.sign(
            { uid: user.uid, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        const expiry = new Date(Date.now() + 3600000);
        await pool.execute(
            'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)',
            [token, user.uid, expiry]
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        }).status(200).json({
            message: 'Login successful',
            user: { username: user.username, role: user.role }
        });

        console.log('Login successful for:', username);

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Login error', error: err.message });
    }
});

// 3. Check Balance
app.get('/api/balance', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const [rows] = await pool.execute('SELECT balance FROM KodUser WHERE uid = ?', [uid]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        await pool.execute(
            'INSERT INTO Transactions (uid, type, amount, status) VALUES (?, ?, ?, ?)',
            [uid, 'Check Balance', 0, 'Success']
        );

        res.status(200).json({ balance: rows[0].balance });
    } catch (err) {
        console.error('Balance Error:', err.message);
        res.status(500).json({ message: 'Error fetching balance' });
    }
});

// 4. Deposit Money
app.post('/api/deposit', verifyToken, async (req, res) => {
    const { amount } = req.body;
    const uid = req.user.uid;
    console.log(`Deposit attempt: UID ${uid}, Amount ${amount}`);

    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    try {
        await pool.execute('UPDATE KodUser SET balance = balance + ? WHERE uid = ?', [amount, uid]);
        await pool.execute(
            'INSERT INTO Transactions (uid, type, amount, status) VALUES (?, ?, ?, ?)',
            [uid, 'Deposit', amount, 'Success']
        );
        res.status(200).json({ message: 'Deposit successful' });
        console.log(`Deposit success: UID ${uid}`);
    } catch (err) {
        console.error('Deposit Error:', err.message);
        res.status(500).json({ message: 'Deposit failed' });
    }
});

// 5. Withdraw Money
app.post('/api/withdraw', verifyToken, async (req, res) => {
    const { amount } = req.body;
    const uid = req.user.uid;
    console.log(`Withdraw attempt: UID ${uid}, Amount ${amount}`);

    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    try {
        const [rows] = await pool.execute('SELECT balance FROM KodUser WHERE uid = ?', [uid]);
        if (rows[0].balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        await pool.execute('UPDATE KodUser SET balance = balance - ? WHERE uid = ?', [amount, uid]);
        await pool.execute(
            'INSERT INTO Transactions (uid, type, amount, status) VALUES (?, ?, ?, ?)',
            [uid, 'Withdraw', amount, 'Success']
        );
        res.status(200).json({ message: 'Withdrawal successful' });
        console.log(`Withdrawal success: UID ${uid}`);
    } catch (err) {
        console.error('Withdraw Error:', err.message);
        res.status(500).json({ message: 'Withdrawal failed' });
    }
});

// 6. Get Transaction History
app.get('/api/transactions', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const [rows] = await pool.execute(
            'SELECT * FROM Transactions WHERE uid = ? ORDER BY timestamp DESC',
            [uid]
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error('Transaction Error:', err.message);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// 7. Get User Info
app.get('/api/user-info', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const [rows] = await pool.execute(
            'SELECT uid, username, email, phone, role, created_at FROM KodUser WHERE uid = ?',
            [uid]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('User Info Error:', err.message);
        res.status(500).json({ message: 'Error fetching user info' });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
});

app.get('/', (req, res) => {
    res.send('Kodbank API is running...');
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
