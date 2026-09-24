
CREATE DATABASE IF NOT EXISTS blogdb;
USE blogdb;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    role ENUM('admin', 'user') DEFAULT 'user',
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


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


-- Insert Users (Admin, Active User, Deactivated User)
INSERT INTO users (id, firstname, lastname, email, password, isActive, role) VALUES
(1, 'Tanvir', 'Ahmed', 'admin@blog.com', 'admin123@password', true, 'admin'),
(2, 'Rahim', 'Mia', 'rahim@blog.com', 'rahim123@password', true, 'user'),
(3, 'Karim', 'Hasan', 'karim@blog.com', 'karim123@password', false, 'user');

-- Insert Initial Sample Blogs for Rahim (userId: 2)
INSERT INTO blogs (id, userId, blogTitle, blog, category) VALUES
(1, 2, 'Mastering Node.js and MySQL Connections', 'Step-by-step guide to setting up mysql2 pool in Node CLI apps.', 'Backend'),
(2, 2, 'Why Unit Testing Matters in SDET', 'Detailed overview of test coverage, automation and quality assurance.', 'Testing');