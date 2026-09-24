require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
    let connection;
    try {

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        console.log('Connected to MySQL server.');


        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database '${process.env.DB_NAME}' created or already exists.`);
        await connection.changeUser({ database: process.env.DB_NAME });


        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        role VARCHAR(20) DEFAULT 'user',
        createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
        await connection.query(createUsersTable);
        console.log("Table 'users' ready.");


        const createBlogsTable = `
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        blogTitle VARCHAR(255) NOT NULL,
        blog TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
        await connection.query(createBlogsTable);
        console.log("Table 'blogs' ready.");

        console.log('\nDatabase setup successfully completed!');
    } catch (error) {
        console.error('Setup failed:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();