# Fortress

A secure warehouse inventory management system built with Node.js and Express, featuring user authentication, authorization, and comprehensive security measures. (Work in Progress)

## Features

- **User Authentication** - JWT-based authentication with secure cookie handling
- **User Management** - CRUD operations for user accounts
- **Security** - Powered by Arcjet for bot detection, rate limiting, and attack prevention
- **Database** - PostgreSQL with Drizzle ORM and Neon serverless driver
- **Validation** - Request validation using Zod schemas
- **Logging** - Structured logging with Winston and Morgan
- **Testing** - Comprehensive test suite with Jest and Supertest
- **Docker** - Ready-to-use Docker configurations for development and production
- **CI/CD** - Automated workflows with GitHub Actions

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle
- **Authentication:** JWT + bcrypt
- **Security:** Arcjet, Helmet, CORS
- **Validation:** Zod
- **Testing:** Jest, Supertest
- **Code Quality:** ESLint, Prettier

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (or Neon account)
- Arcjet API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/JoseBarr777/fortress.git
cd fortress
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=your_neon_database_url
ARCJET_KEY=your_arcjet_api_key
```

### 4. Run database migrations

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm start`            | Start production server                  |
| `npm test`             | Run test suite                           |
| `npm run lint`         | Check code for linting errors            |
| `npm run lint:fix`     | Fix linting errors automatically         |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check code formatting                    |
| `npm run db:generate`  | Generate database migrations             |
| `npm run db:migrate`   | Run database migrations                  |
| `npm run db:studio`    | Open Drizzle Studio (database GUI)       |
| `npm run docker:dev`   | Run development environment with Docker  |
| `npm run docker:prod`  | Run production environment with Docker   |

## API Endpoints

### Health Check

- `GET /health` - Check API health status

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users` - Get all users (authenticated)
- `GET /api/users/:id` - Get user by ID (authenticated)
- `PUT /api/users/:id` - Update user (authenticated)
- `DELETE /api/users/:id` - Delete user (authenticated)

## Docker

### Development

```bash
npm run docker:dev
```

### Production

```bash
npm run docker:prod
```

## Testing

Run the test suite:

```bash
npm test
```

Tests include:

- Authentication flow
- User CRUD operations
- Middleware validation
- Security measures

## Project Structure

```
fortress/
├── src/
│   ├── config/         # Configuration files (database, logger, arcjet)
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware (auth, security)
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── validations/    # Zod validation schemas
│   ├── utils/          # Utility functions
│   ├── errors/         # Error handling
│   ├── policies/       # Authorization policies
│   ├── app.js          # Express app configuration
│   ├── server.js       # Server startup
│   └── index.js        # Entry point
├── tests/              # Test files
├── drizzle/            # Database migrations
└── scripts/            # Utility scripts
```

## CI/CD

The project includes GitHub Actions workflows for:

- **Linting and Formatting** - Ensures code quality
- **Testing** - Runs test suite on every push
- **Docker Build & Push** - Builds and deploys Docker images

## License

MIT

## Acknowledgments

This project was built as a hands-on DevOps learning experience, following the tutorial [DevOps from Zero to Hero: Build and Deploy a Production API](https://www.youtube.com/watch?v=H5FAxTBuNM8&t=364s). The tutorial provided the foundation for implementing production-ready DevOps practices:

### DevOps Practices Implemented:
- **Docker Containerization** - Multi-stage Dockerfile optimized for development and production
- **Container Orchestration** - Docker Compose configurations for both environments
- **CI/CD Pipeline** - GitHub Actions workflows for automated testing, linting, and Docker image deployment
- **Infrastructure as Code** - Automated deployment scripts with health checks and database migrations
- **Production Security** - Helmet, CORS, Arcjet integration for bot detection and rate limiting
- **Observability** - Structured logging with Winston, comprehensive error handling
- **Database Management** - Drizzle ORM with automated migrations, Neon serverless PostgreSQL
- **Testing Infrastructure** - Jest and Supertest integration with CI pipeline
- **Code Quality** - ESLint, Prettier with automated checks in CI/CD

### Planned Extensions:
Building this into a complete **warehouse inventory management system** to demonstrate end-to-end application development and deployment:
- Multi-warehouse support with location tracking
- Product/SKU management system
- Real-time stock movement tracking and auditing
- Low-stock alerts and reporting dashboard
- RESTful API architecture with comprehensive validation

This project demonstrates the ability to implement enterprise-grade DevOps practices and extend a base application into a production-ready system.
