const db = require('./db');


async function register(firstname, lastname, email, password) {
    try {

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('Error: Email already exists. Please login or use another email.');
            return false;
        }

        const query = `
      INSERT INTO users (firstname, lastname, email, password, isActive, role)
      VALUES (?, ?, ?, ?, true, 'user')
    `;
        await db.query(query, [firstname, lastname, email, password]);
        console.log('Registration successful! You can now log in.');
        return true;
    } catch (error) {
        console.error('Registration failed:', error.message);
        return false;
    }
}


async function login(email, password) {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            console.log('User not found with this email.');
            return null;
        }

        const user = rows[0];


        if (user.password !== password) {
            console.log('Incorrect password.');
            return null;
        }


        if (!user.isActive) {
            console.log('User is deactivated');
            return null;
        }

        console.log(`\nLogin successful! Welcome, ${user.firstname} (${user.role.toUpperCase()})`);
        return user;
    } catch (error) {
        console.error('Login failed:', error.message);
        return null;
    }
}

module.exports = {
    register,
    login
};