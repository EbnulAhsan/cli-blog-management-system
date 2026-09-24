const db = require('./db');


async function allBlog() {
    try {
        const query = `
      SELECT b.id, b.blogTitle, b.blog, b.category, b.createAt, 
             CONCAT(u.firstname, ' ', u.lastname) AS author
      FROM blogs b
      JOIN users u ON b.userId = u.id
      ORDER BY b.createAt DESC
    `;
        const [blogs] = await db.query(query);

        if (blogs.length === 0) {
            console.log('\nNo blogs are found in the system.\n');
            return;
        }

        console.log('\n================ ALL BLOGS ================');
        blogs.forEach((b) => {
            console.log(`ID: ${b.id} | Title: ${b.blogTitle} | Category: ${b.category} | Author: ${b.author}`);
            console.log(`Content: ${b.blog}`);
            console.log('-------------------------------------------');
        });
    } catch (error) {
        console.error('Error fetching blogs:', error.message);
    }
}


async function viewUserBlogs(userId) {
    try {
        const [blogs] = await db.query(
            'SELECT id, blogTitle FROM blogs WHERE userId = ? ORDER BY createAt DESC',
            [userId]
        );

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
        let query = `
      SELECT b.id, b.blogTitle, b.blog, b.category, b.createAt,
             CONCAT(u.firstname, ' ', u.lastname) AS author
      FROM blogs b
      JOIN users u ON b.userId = u.id
      WHERE (b.id = ? OR b.blogTitle LIKE ?)
    `;
        const params = [searchTerm, `%${searchTerm}%`];


        if (userId) {
            query += ' AND b.userId = ?';
            params.push(userId);
        }

        const [results] = await db.query(query, params);

        if (results.length === 0) {
            console.log('\nNo matching blog found.');
            return;
        }

        console.log('\n=== SEARCH RESULTS ===');
        results.forEach((b) => {
            console.log(`ID: ${b.id} | Title: ${b.blogTitle} | Category: ${b.category} | Author: ${b.author}`);
            console.log(`Content: ${b.blog}`);
            console.log('----------------------');
        });
    } catch (error) {
        console.error('Search failed:', error.message);
    }
}


async function createBlog(userId, blogTitle, blog, category) {
    try {
        const query = `
      INSERT INTO blogs (userId, blogTitle, blog, category)
      VALUES (?, ?, ?, ?)
    `;
        const [result] = await db.query(query, [userId, blogTitle, blog, category]);
        console.log(`\nBlog created successfully! (Blog ID: ${result.insertId})`);
    } catch (error) {
        console.error('Error creating blog:', error.message);
    }
}


async function updateBlog(blogId, userId, newTitle, newContent, newCategory) {
    try {
        const [blog] = await db.query('SELECT * FROM blogs WHERE id = ? AND userId = ?', [blogId, userId]);
        if (blog.length === 0) {
            console.log('\nBlog not found or you do not have permission to update this blog.');
            return;
        }

        const query = `
      UPDATE blogs 
      SET blogTitle = COALESCE(NULLIF(?, ''), blogTitle),
          blog = COALESCE(NULLIF(?, ''), blog),
          category = COALESCE(NULLIF(?, ''), category)
      WHERE id = ? AND userId = ?
    `;
        await db.query(query, [newTitle, newContent, newCategory, blogId, userId]);
        console.log('\nBlog updated successfully!');
    } catch (error) {
        console.error('Error updating blog:', error.message);
    }
}


async function deleteBlog(blogId, userId = null) {
    try {
        let query = 'DELETE FROM blogs WHERE id = ?';
        const params = [blogId];

        if (userId) {
            query += ' AND userId = ?';
            params.push(userId);
        }

        const [result] = await db.query(query, params);
        if (result.affectedRows === 0) {
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