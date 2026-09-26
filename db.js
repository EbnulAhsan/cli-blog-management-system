const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// 1. Sequelize Connection Instance
const sequelize = new Sequelize(
    process.env.DB_NAME || 'blogdb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: false // assignment requirements অনুয়ায়ী কাস্টম createAt/updateAt ফিল্ড ব্যবহার হবে
        }
    }
);

// 2. User Model Definition
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    createAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updateAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users'
});

// 3. Blog Model Definition
const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    blogTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blog: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updateAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'blogs'
});

// 4. Relationships (Foreign Key userId reference to users.id)
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// 5. Test Connection
const testDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Sequelize: Database connection established successfully.');
    } catch (error) {
        console.error('❌ Sequelize connection error:', error.message);
    }
};
testDb();

module.exports = {
    sequelize,
    User,
    Blog
};