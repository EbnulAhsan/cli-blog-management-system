const readline = require('readline-sync');
const authService = require('./authService');
const blogService = require('./blogService');
const adminService = require('./adminService');


async function userMenu(currentUser) {
    let inUserSession = true;


    await blogService.viewUserBlogs(currentUser.id);

    while (inUserSession) {
        console.log('\n--- USER CONSOLE MENU ---');
        console.log('1. View Your Blogs');
        console.log('2. Search Blog by ID/Title');
        console.log('3. Create Blog');
        console.log('4. Update Blog');
        console.log('5. Delete Blog');
        console.log('6. Logout');

        const choice = readline.question('\nSelect an option: ');

        switch (choice.trim()) {
            case '1':
                await blogService.viewUserBlogs(currentUser.id);
                break;

            case '2': {
                const term = readline.question('Enter Blog ID or Title: ');
                await blogService.searchBlog(term, currentUser.id);
                break;
            }

            case '3': {
                const title = readline.question('Blog Title: ');
                const content = readline.question('Blog Content: ');
                const category = readline.question('Category: ');
                await blogService.createBlog(currentUser.id, title, content, category);
                break;
            }

            case '4': {
                const blogId = readline.question('Enter Blog ID to update: ');
                const newTitle = readline.question('New Title (Leave empty to keep unchanged): ');
                const newContent = readline.question('New Content (Leave empty to keep unchanged): ');
                const newCategory = readline.question('New Category (Leave empty to keep unchanged): ');
                await blogService.updateBlog(blogId, currentUser.id, newTitle, newContent, newCategory);
                break;
            }

            case '5': {
                const blogId = readline.question('Enter Blog ID to delete: ');
                await blogService.deleteBlog(blogId, currentUser.id);
                break;
            }

            case '6':
                console.log('\nLogged out successfully.');
                inUserSession = false;
                break;

            default:
                console.log('Invalid option. Please try again.');
        }
    }
}


async function adminMenu(currentUser) {
    let inAdminSession = true;

    while (inAdminSession) {
        console.log('\n--- ADMIN CONSOLE MENU ---');
        console.log('1. View All Users');
        console.log('2. View All Blogs');
        console.log('3. Search Blog by ID/Title');
        console.log('4. Update User');
        console.log('5. Delete User');
        console.log('6. Delete Blog');
        console.log('7. Logout');

        const choice = readline.question('\nSelect an option: ');

        switch (choice.trim()) {
            case '1':
                await adminService.allUsers();
                break;

            case '2':
                await adminService.allUsersBlog();
                break;

            case '3': {
                const term = readline.question('Enter Blog ID or Title: ');
                await blogService.searchBlog(term);
                break;
            }

            case '4': {
                const userId = readline.question('Enter User ID: ');
                const statusInput = readline.question('Set Active status (true/false): ');
                const isActive = statusInput.trim().toLowerCase() === 'true';
                await adminService.updateUserStatus(userId, isActive);
                break;
            }

            case '5': {
                const userId = readline.question('Enter User ID to delete: ');
                await adminService.deleteUser(userId);
                break;
            }

            case '6': {
                const blogId = readline.question('Enter Blog ID to delete: ');
                await blogService.deleteBlog(blogId);
                break;
            }

            case '7':
                console.log('\nAdmin logged out successfully.');
                inAdminSession = false;
                break;

            default:
                console.log('Invalid option. Please try again.');
        }
    }
}


async function main() {
    let isRunning = true;

    while (isRunning) {
        console.log('\n=============================');
        console.log('   WELCOME TO BLOG APP CLI   ');
        console.log('=============================');
        console.log('1. View All Blogs');
        console.log('2. Login');
        console.log('3. Register');
        console.log('4. Exit');

        const option = readline.question('\nSelect an option: ');

        switch (option.trim()) {
            case '1':

                await blogService.allBlog();
                break;

            case '2': {
                console.log('\n--- LOGIN ---');
                const email = readline.question('Email: ');
                const password = readline.question('Password: ', { hideEchoBack: true });
                const user = await authService.login(email, password);

                if (user) {
                    if (user.role === 'admin') {
                        await adminMenu(user);
                    } else {
                        await userMenu(user);
                    }
                }
                break;
            }

            case '3': {
                console.log('\n--- REGISTER ---');
                const firstname = readline.question('First Name: ');
                const lastname = readline.question('Last Name: ');
                const email = readline.question('Email: ');
                const password = readline.question('Password: ', { hideEchoBack: true });
                await authService.register(firstname, lastname, email, password);
                break;
            }

            case '4':
                console.log('\nExiting application. Goodbye!');
                process.exit(0);

            default:
                console.log('Invalid option. Please choose between 1 and 4.');
        }
    }
}

main();