# CLI Blog Management System

A command-line blog management platform built with **Node.js** and **MySQL**, featuring secure authentication, Role-Based Access Control (RBAC), and full CRUD operations for blog posts.

![Node.js](https://img.shields.io/badge/Node.js-CLI-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Roles & Permissions](#roles--permissions)
- [License](#license)

---

## Overview

The **CLI Blog Management System** is a terminal-based application that allows users to register, authenticate, and manage blog content through a role-aware access model. Public visitors can browse published blogs without an account, while authenticated users and administrators are granted permissions scoped to their role.

---

## Features

- **Public Access** — Anyone can view all published blogs without logging in.
- **User Authentication** — Secure registration, login, and password handling.
- **Role-Based Access Control (RBAC)**
  - **User**
    - Create new blog posts
    - View personal blogs
    - Search blogs by ID or title
    - Update own blogs
    - Delete own blogs
  - **Admin**
    - View all registered users
    - Activate or deactivate user accounts
    - Search all blogs across the system
    - Delete any blog
    - View all blogs
- **Soft Deactivation** — Deactivated users are blocked from logging in and receive a clear `User is deactivated` notice.

---

## Tech Stack

| Category            | Technology         |
|----------------------|--------------------|
| Runtime              | Node.js            |
| Database              | MySQL              |
| DB Management Tool   | DBeaver            |
| Core Libraries        | `mysql2`, `dotenv`, `readline` / `prompts` |

---

## Database Schema

Create the database and required tables using the schema below:

```sql
CREATE DATABASE IF NOT EXISTS blog_system;
USE blog_system;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Entity relationship summary:**
- Each `blog` belongs to exactly one `user` via `user_id`.
- Deleting a user cascades and removes their associated blogs (`ON DELETE CASCADE`).

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MySQL](https://www.mysql.com/) server running locally or remotely
- [DBeaver](https://dbeaver.io/) (optional, for database management)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/EbnulAhsan/cli-blog-management-system.git
   cd cli-blog-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   Run the schema in the [Database Schema](#database-schema) section against your MySQL instance.

4. **Configure environment variables**
   See [Configuration](#configuration) below.

5. **Run the application**
   ```bash
   node app.js
   ```

---

## Configuration

Create a `.env` file in the project root with the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog_system
```

| Variable      | Description                          |
|---------------|---------------------------------------|
| `DB_HOST`     | MySQL server host                     |
| `DB_USER`     | MySQL username                        |
| `DB_PASSWORD` | MySQL password                        |
| `DB_NAME`     | Database name (`blog_system`)         |

> **Note:** Never commit your `.env` file to version control. Add it to `.gitignore`.

---

## Usage

Launch the CLI:

```bash
node app.js
```

You will be prompted to either:
1. **Browse published blogs** (no login required), or
2. **Log in / Register** to access role-specific features.

Once authenticated, the CLI presents a menu tailored to your role (User or Admin), guiding you through blog creation, search, updates, and administrative actions.

---

## Project Structure

```
cli-blog-management-system/
├── app.js               # Application entry point
├── config/               # Database and environment configuration
├── controllers/          # Business logic for auth, blogs, and users
├── models/                # Database queries and schema interactions
├── utils/                  # Helper functions (validation, prompts, etc.)
├── .env                   # Environment variables (not committed)
├── package.json
└── README.md
```

> Adjust this structure to match your actual folder layout.

---

## Roles & Permissions

| Action                          | Public | User | Admin |
|----------------------------------|:------:|:----:|:-----:|
| View published blogs             | ✅     | ✅   | ✅    |
| Register / Login                 | ✅     | ✅   | ✅    |
| Create a blog                    | ❌     | ✅   | ✅    |
| Update own blog                  | ❌     | ✅   | ✅    |
| Delete own blog                  | ❌     | ✅   | ✅    |
| Search blogs by ID/title         | ❌     | ✅   | ✅    |
| Delete any user's blog           | ❌     | ❌   | ✅    |
| View all registered users        | ❌     | ❌   | ✅    |
| Activate/deactivate users        | ❌     | ❌   | ✅    |

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Author:** [Md. Ebnul Ahsan](https://github.com/EbnulAhsan)
