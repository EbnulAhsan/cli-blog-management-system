const { User } = require('./db');

async function register(firstname, lastname, email, password) {
    try {

        const existing = await User.findOne({
            where: { email: email }
        });

        if (existing) {
            console.log('Error: Email already exists. Please login or use another email.');
            return false;
        }

        // 2. Create new user using Sequelize
        await User.create({
            firstname,
            lastname,
            email,
            password,
            isActive: true,
            role: 'user'
        });

        console.log('Registration successful! You can now log in.');
        return true;
    } catch (error) {
        console.error('Registration failed:', error.message);
        return false;
    }
}

async function login(email, password) {
    try {

        const userInstance = await User.findOne({
            where: { email: email }
        });

        if (!userInstance) {
            console.log('User not found with this email.');
            return null;
        }

        const user = userInstance.toJSON();

        // 2. Validate password
        if (user.password !== password) {
            console.log('Incorrect password.');
            return null;
        }

        // 3. Check if user is active
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