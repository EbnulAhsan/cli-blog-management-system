const db = require('./db');


async function allUsers() {
    try {
        const query = `
      SELECT id, firstname, lastname, email, isActive, role, createAt 
      FROM users 
      ORDER BY id ASC
    `;
        const [users] = await db.query(query);

        if (users.length === 0) {
            console.log('\nNo users found in the system.');
            return;
        }

        console.log('\n================ ALL USERS ================');
        users.forEach((u) => {
            console.log(`ID: ${u.id} | Name: ${u.firstname} ${u.lastname} | Email: ${u.email} | Role: ${u.role} | Active: ${Boolean(u.isActive)}`);
        });
        console.log('===========================================');
    } catch (error) {
        console.error('Error fetching users:', error.message);
    }
}


async function allUsersBlog() {
    try {
        const query = `
      SELECT b.id, b.blogTitle, b.blog, b.category, b.createAt,
             u.id AS authorId, CONCAT(u.firstname, ' ', u.lastname) AS authorName
      FROM blogs b
      JOIN users u ON b.userId = u.id
      ORDER BY b.createAt DESC
    `;
        const [blogs] = await db.query(query);

        if (blogs.length === 0) {
            console.log('\nNo blogs found.');
            return;
        }

        console.log('\n================ ALL USERS BLOGS ================');
        blogs.forEach((b) => {
            console.log(`Blog ID: ${b.id} | Title: ${b.blogTitle} | Category: ${b.category}`);
            console.log(`Author: ${b.authorName} (User ID: ${b.authorId})`);
            console.log(`Content: ${b.blog}`);
            console.log('-------------------------------------------------');
        });
    } catch (error) {
        console.error('Error fetching all blogs:', error.message);
    }
}


async function updateUserStatus(userId, isActive) {
    try {
        const [result] = await db.query(
            'UPDATE users SET isActive = ? WHERE id = ?',
            [isActive, userId]
        );

        if (result.affectedRows === 0) {
            console.log('\nUser not found.');
            return;
        }

        console.log(`\nUser status successfully updated to: ${isActive ? 'Active' : 'Deactivated'}`);
    } catch (error) {
        console.error('Error updating user status:', error.message);
    }
}


async function deleteUser(userId) {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            console.log('\nUser not found.');
            return;
        }

        console.log('\nUser and their associated blogs deleted successfully!');
    } catch (error) {
        console.error('Error deleting user:', error.message);
    }
}

module.exports = {
    allUsers,
    allUsersBlog,
    updateUserStatus,
    deleteUser
};