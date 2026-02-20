require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    const connectionConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : null,
        multipleStatements: true // Essential for running the full schema.sql
    };

    try {
        console.log('Connecting to Aiven MySQL...');
        const connection = await mysql.createConnection(connectionConfig);
        console.log('Connected!');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema.sql...');
        await connection.query(schemaSql);

        console.log('------------------------------------------');
        console.log('SUCCESS: Database initialized successfully!');
        console.log('Tables "KodUser" and "UserToken" are ready.');
        console.log('------------------------------------------');

        await connection.end();
    } catch (error) {
        console.error('ERROR: Could not initialize database.');
        console.error(error.message);
        console.log('\nTip: Check your .env file credentials and ensure your Aiven service is "Running".');
    }
}

initializeDatabase();
