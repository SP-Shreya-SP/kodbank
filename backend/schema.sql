CREATE DATABASE IF NOT EXISTS defaultdb;
USE defaultdb;

-- Reset Tables to ensure new schema is applied
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS UserToken;
DROP TABLE IF EXISTS KodUser;

-- 1. KodUser Table
CREATE TABLE KodUser (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 100000.00,
    phone VARCHAR(20),
    role ENUM('Customer', 'Manager', 'Admin') DEFAULT 'Customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. UserToken Table
CREATE TABLE UserToken (
    tid INT AUTO_INCREMENT PRIMARY KEY,
    token TEXT NOT NULL,
    uid INT NOT NULL,
    expiry DATETIME NOT NULL,
    FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
);

-- 3. Transactions Table
CREATE TABLE Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid INT NOT NULL,
    type ENUM('Deposit', 'Withdraw', 'Check Balance', 'Registration') NOT NULL,
    amount DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Success', 'Failed') DEFAULT 'Success',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
);
