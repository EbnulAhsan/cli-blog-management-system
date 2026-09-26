const { Op } = require('sequelize');
const { Blog, User } = require('./db');

async function allBlog() {
    try {
        const blogs = await Blog.findAll({
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['firstname', 'lastname']
                }
            ],
            order: [['createAt', 'DESC']]
        });

        if (blogs.length === 0) {
            console.log('\nNo blogs are found in the system.\n');
            return;
        }

        console.log('\n================ ALL BLOGS ================');
        blogs.forEach((b) => {
            const blogData = b.toJSON();
            const authorName = blogData.author
                ? `${blogData.author.firstname} ${blogData.author.lastname}`
                : 'Unknown';

            console.log(`ID: ${blogData.id} | Title: ${blogData.blogTitle} | Category: ${blogData.category} | Author: ${authorName}`);
            console.log(`Content: ${blogData.blog}`);
            console.log('-------------------------------------------');
        });
    } catch (error) {
        console.error('Error fetching blogs:', error.message);
    }
}

async function viewUserBlogs(userId) {
    try {
        const blogs = await Blog.findAll({
            where: { userId: userId },
            attributes: ['id', 'blogTitle'],
            order: [['createAt', 'DESC']]
        });

        if (blogs.length === 0) {
            console.log('\nNo blogs are found');
            return;
        }

        console.log('\n=== YOUR BLOG TITLES ===');
        blogs.forEach((b) => {
            console.log(`[ID: ${b.id}] - ${b.blogTitle}`);
        });
        console.log('========================');
    } catch (error) {
        console.error('Error fetching user blogs:', error.message);
    }
}

async function searchBlog(searchTerm, userId = null) {
    try {
        const isNumeric = !isNaN(searchTerm) && !isNaN(parseFloat(searchTerm));


        const searchConditions = [{ blogTitle: { [Op.like]: `%${searchTerm}%` } }];
        if (isNumeric) {
            searchConditions.push({ id: Number(searchTerm) });
        }

        const whereClause = {
            [Op.or]: searchConditions
        };

        if (userId) {
            whereClause.userId = userId;
        }

        const results = await Blog.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['firstname', 'lastname']
                }
            ]
        });

        if (results.length === 0) {
            console.log('\nNo matching blog found.');
            return;
        }

        console.log('\n=== SEARCH RESULTS ===');
        results.forEach((b) => {
            const blogData = b.toJSON();
            const authorName = blogData.author
                ? `${blogData.author.firstname} ${blogData.author.lastname}`
                : 'Unknown';

            console.log(`ID: ${blogData.id} | Title: ${blogData.blogTitle} | Category: ${blogData.category} | Author: ${authorName}`);
            console.log(`Content: ${blogData.blog}`);
            console.log('----------------------');
        });
    } catch (error) {
        console.error('Search failed:', error.message);
    }
}

async function createBlog(userId, blogTitle, blog, category) {
    try {
        const newBlog = await Blog.create({
            userId,
            blogTitle,
            blog,
            category
        });

        console.log(`\nBlog created successfully! (Blog ID: ${newBlog.id})`);
    } catch (error) {
        console.error('Error creating blog:', error.message);
    }
}

async function updateBlog(blogId, userId, newTitle, newContent, newCategory) {
    try {

        const existingBlog = await Blog.findOne({
            where: { id: blogId, userId: userId }
        });

        if (!existingBlog) {
            console.log('\nBlog not found or you do not have permission to update this blog.');
            return;
        }


        const updatePayload = {};
        if (newTitle && newTitle.trim() !== '') updatePayload.blogTitle = newTitle;
        if (newContent && newContent.trim() !== '') updatePayload.blog = newContent;
        if (newCategory && newCategory.trim() !== '') updatePayload.category = newCategory;

        await existingBlog.update(updatePayload);
        console.log('\nBlog updated successfully!');
    } catch (error) {
        console.error('Error updating blog:', error.message);
    }
}

async function deleteBlog(blogId, userId = null) {
    try {
        const whereClause = { id: blogId };
        if (userId) {
            whereClause.userId = userId;
        }

        const deletedCount = await Blog.destroy({
            where: whereClause
        });

        if (deletedCount === 0) {
            console.log('\nBlog not found or permission denied.');
            return;
        }

        console.log('\nBlog deleted successfully!');
    } catch (error) {
        console.error('Error deleting blog:', error.message);
    }
}

module.exports = {
    allBlog,
    viewUserBlogs,
    searchBlog,
    createBlog,
    updateBlog,
    deleteBlog
};