const { User, Blog } = require('./db');

async function allUsers() {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstname', 'lastname', 'email', 'isActive', 'role', 'createAt'],
            order: [['id', 'ASC']]
        });

        if (users.length === 0) {
            console.log('\nNo users found in the system.');
            return;
        }

        console.log('\n================ ALL USERS ================');
        users.forEach((u) => {
            const userData = u.toJSON();
            console.log(
                `ID: ${userData.id} | Name: ${userData.firstname} ${userData.lastname} | Email: ${userData.email} | Role: ${userData.role} | Active: ${Boolean(userData.isActive)}`
            );
        });
        console.log('===========================================');
    } catch (error) {
        console.error('Error fetching users:', error.message);
    }
}

async function allUsersBlog() {
    try {
        const blogs = await Blog.findAll({
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'firstname', 'lastname']
                }
            ],
            order: [['createAt', 'DESC']]
        });

        if (blogs.length === 0) {
            console.log('\nNo blogs found.');
            return;
        }

        console.log('\n================ ALL USERS BLOGS ================');
        blogs.forEach((b) => {
            const blogData = b.toJSON();
            const authorName = blogData.author
                ? `${blogData.author.firstname} ${blogData.author.lastname}`
                : 'Unknown';
            const authorId = blogData.author ? blogData.author.id : 'N/A';

            console.log(`Blog ID: ${blogData.id} | Title: ${blogData.blogTitle} | Category: ${blogData.category}`);
            console.log(`Author: ${authorName} (User ID: ${authorId})`);
            console.log(`Content: ${blogData.blog}`);
            console.log('-------------------------------------------------');
        });
    } catch (error) {
        console.error('Error fetching all blogs:', error.message);
    }
}

async function updateUserStatus(userId, isActive) {
    try {
        const [updatedCount] = await User.update(
            { isActive: isActive },
            { where: { id: userId } }
        );

        if (updatedCount === 0) {
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
        
        await Blog.destroy({
            where: { userId: userId }
        });

        // 2. Delete the user
        const deletedCount = await User.destroy({
            where: { id: userId }
        });

        if (deletedCount === 0) {
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