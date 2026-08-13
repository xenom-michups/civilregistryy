# Civil Registry System

A modern, full-stack web application for managing civil status certificates (birth and marriage) built with Node.js, Express, MySQL, and a beautiful Tailwind CSS UI.

## Features

- 🔐 Secure authentication with JWT
- 📝 Birth certificate registration and management
- 💒 Marriage certificate registration and management
- 📊 Dashboard with analytics and charts
- 📄 PDF certificate generation
- 📤 Bulk CSV import
- 🎨 Modern, responsive UI with dark theme
- 🔒 Role-based access control (Admin/Registrar)

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL with Sequelize ORM
- **Frontend:** Pug templates, Tailwind CSS
- **Authentication:** JWT with HTTP-only cookies
- **PDF Generation:** Puppeteer

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kaid00/civil-status-registry.git
   cd civil-status-registry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Edit `config.env` with your settings:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # MySQL Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=civil_registry
   DB_USER=root
   DB_PASSWORD=your_password
   
   # JWT
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE civil_registry;
   ```

5. **Run migrations**
   ```bash
   npm run db:migrate
   ```

6. **Seed the database** (optional - adds demo data)
   ```bash
   npm run db:seed
   ```

7. **Build CSS** (if you modify styles)
   ```bash
   npm run build:css:prod
   ```

8. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

9. **Access the application**
   
   Open http://localhost:3000 in your browser

## Demo Credentials

After seeding the database:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@civilregistry.com | password123 |
| Registrar | registrar@civilregistry.com | password123 |

## API Endpoints

### Authentication
- `POST /api/users/login` - Login
- `GET /api/users/logout` - Logout
- `POST /api/users/forgotPassword` - Request password reset
- `PATCH /api/users/resetPassword/:token` - Reset password

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users/signup` - Create new user
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user

### Birth Certificates
- `GET /api/certificates/birth` - Get all birth certificates
- `POST /api/certificates/birth` - Create birth certificate
- `GET /api/certificates/birth/:id` - Get birth certificate by ID
- `PATCH /api/certificates/birth/:id` - Update birth certificate
- `DELETE /api/certificates/birth/:id` - Delete birth certificate (Admin only)
- `GET /api/certificates/birth/stats` - Get birth statistics

### Marriage Certificates
- `GET /api/certificates/marriage` - Get all marriage certificates
- `POST /api/certificates/marriage` - Create marriage certificate
- `GET /api/certificates/marriage/:id` - Get marriage certificate by ID
- `PATCH /api/certificates/marriage/:id` - Update marriage certificate
- `DELETE /api/certificates/marriage/:id` - Delete marriage certificate (Admin only)
- `GET /api/certificates/marriage/stats` - Get marriage statistics

## Project Structure

```
civil-registry/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── birthController.js   # Birth certificate CRUD
│   ├── marriageController.js # Marriage certificate CRUD
│   ├── userController.js    # User management
│   └── viewController.js    # View rendering
├── database/
│   ├── migrations/          # Sequelize migrations
│   └── seeders/             # Database seeders
├── models/
│   ├── index.js             # Sequelize setup
│   ├── User.js              # User model
│   ├── Birth.js             # Birth certificate model
│   └── Marriage.js          # Marriage certificate model
├── public/
│   ├── images/              # Static images
│   ├── js/                  # Client-side JavaScript
│   └── styles/              # CSS files
├── routes/
│   ├── birthRoutes.js       # Birth API routes
│   ├── marriageRoutes.js    # Marriage API routes
│   ├── usersRoutes.js       # User API routes
│   └── viewRoutes.js        # View routes
├── src/
│   └── input.css            # Tailwind source CSS
├── utils/
│   └── email.js             # Email utility
├── views/                   # Pug templates
├── app.js                   # Express app setup
├── config.env               # Environment variables
├── package.json
├── tailwind.config.js
└── README.md
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:reset` | Reset database (migrate + seed) |
| `npm run build:css` | Build Tailwind CSS (watch mode) |
| `npm run build:css:prod` | Build minified Tailwind CSS |

## License

MIT License - see LICENSE file for details.

## Author

Civil Registry Team
