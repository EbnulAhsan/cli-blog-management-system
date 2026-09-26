const fs = require('fs');
const path = require('path');
const { sequelize, User, Blog } = require('./db');

async function seedDatabase() {
    try {

        const dataPath = path.join(__dirname, 'testData.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const data = JSON.parse(rawData);


        await sequelize.sync({ force: true });
        console.log('🔄 Database synced & tables reset successfully.');


        const accounts = data.accounts;
        const usersToInsert = [
            {
                id: 1,
                firstname: 'Tanvir',
                lastname: 'Ahmed',
                email: accounts.admin.email,
                password: accounts.admin.password,
                isActive: accounts.admin.isActive,
                role: accounts.admin.role
            },
            {
                id: 2,
                firstname: 'Rahim',
                lastname: 'Mia',
                email: accounts.activeUser.email,
                password: accounts.activeUser.password,
                isActive: accounts.activeUser.isActive,
                role: accounts.activeUser.role
            },
            {
                id: 3,
                firstname: 'Karim',
                lastname: 'Hasan',
                email: accounts.deactivatedUser.email,
                password: accounts.deactivatedUser.password,
                isActive: accounts.deactivatedUser.isActive,
                role: accounts.deactivatedUser.role
            }
        ];

        await User.bulkCreate(usersToInsert);
        console.log('✅ Users inserted successfully from testData.json.');


        const blogsToInsert = data.sampleBlogsForUser2.map(b => ({
            id: b.id,
            userId: b.userId,
            blogTitle: b.blogTitle,
            blog: b.blog,
            category: b.category
        }));

        await Blog.bulkCreate(blogsToInsert);
        console.log('✅ Sample blogs inserted successfully from testData.json.');

        console.log(' Database loaded completely with Sequelize models!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to seed database:', error.message);
        process.exit(1);
    }
}

seedDatabase();