# 🚀 Nest Backend Toolkit
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)


A **production-ready backend boilerplate** built with **NestJS**, following a **Modular Architecture**.
Designed for scalability, maintainability, and rapid development of enterprise-grade applications.

This project emphasizes **clean code**, **dependency injection**, and **robust security practices**.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **JWT Authentication**: Access Token & Refresh Token (Cookie-based & Rotation)
- **OAuth 2.0**: Login with **Google** & **LinkedIn**
- **API Key Security**: Machine-to-machine authentication via `x-api-key` header
- **RBAC**: Role-based access control (User/Admin) with `@Roles()` decorator
- **Secure Password**: Bcrypt hashing & Password Reset flow via Email

### 🛡 Advanced Security
- **HTTP Headers**: Secured with **Helmet** (Content-Security-Policy, XSS Filter, etc.)
- **HPP Protection**: Prevents HTTP Parameter Pollution attacks
- **Advanced CORS**: Advanced configuration with dynamic origin whitelist
- **Rate Limiting**: Built-in protection against brute-force and DDoS using `@nestjs/throttler`
- **Validation**: Strict Input Validation using `class-validator` & `zod` for Environment Variables

### 📦 User & Notification System
- **User Management**: CRUD operations, Profile update, Avatar upload (Cloudinary)
- **Notification System**: Store and retrieve user notifications with unread count badge support
- **Session Management**: Secure session tracking stored in MongoDB

### 🚀 Infrastructure & Performance
- **Centralized Config**: Type-safe configuration management using `ConfigService` & `zod`
- **Structured Logging**: JSON structured logs with **Winston** (RequestId tracing included), ready for ELK/Sentry
- **Health Checks**: `/health` endpoint for Liveness/Readiness probes (Docker/K8s friendly)
- **File Storage**: Seamless integration with **Cloudinary** for media assets
- **Global Error Handling**: Standardized API Responses and Exception Filters

---

## 🧱 Module-Based Architecture

```bash
src
├── common              # Shared resources across modules
│   ├── config          # Zod-validated Environment & App Configs
│   ├── database        # Mongoose setup & Abstract Repository Pattern
│   ├── decorators      # Custom Decorators (@Roles, etc.)
│   ├── dto             # Shared DTOs (Pagination, ApiResponse)
│   ├── exceptions      # Custom Exception Classes & Filters
│   ├── filters         # Global Exception Filters
│   ├── guards          # Auth Guards (JWT, API Key, Roles)
│   ├── interceptors    # Response Transform, Logging, Timeout, RequestID
│   ├── logger          # Winston Logger Service
│   ├── pipes           # Validation & ParseID Pipes
│   ├── security        # Hashing, Passport Strategies (JWT, Google, LinkedIn)
│   ├── storage         # Cloudinary Service
│   └── utils           # Helpers (Nanoid, Slug, Sleep)
│
├── modules             # Business Logic Domains
│   ├── auth            # Login, Register, OAuth, Refresh Token
│   ├── user            # User Management, Profile
│   ├── session         # Session Storage Logic
│   ├── notification    # In-app Notifications
│   ├── mail            # Email Service
│   └── health          # Health Check System
│
├── app.module.ts       # Root Module
└── main.ts             # Application Entry Point
```

## 🛠 Tech Stack

|Category|Technologies|
|:-:|:-:|
| Frameword | NestJS (Express adapter) |
| Language | Typescript |
| Database | MongoDB |
| Auth | JWT, Passport, Bcrypt |
| Validation | Zod (Env), Class-Validator (DTO) |
| Security | Helmet, HPP, Throttler (Rate Limit) |
| Logging | Winston (Structured Logging) |
| Storage | Cloudinary (Multer) |
| Mailing | Nodemailer |

---

## 📌 Design Patterns Used
- **Dependency Injection (DI)**: The core pattern of NestJS. Services, Repositories, and Helpers are injected into Controllers/Modules, ensuring loose coupling and better testability
- **Repository Pattern**: Abstraction layer `BaseRepository` over Mongoose models to separate business logic from database queries
- **Decorator Pattern**: Heavy usage of decorators for Metadata, Routing, and Guards `@Roles()`, `@Get()`, `@UseGuards()`
- **Strategy Pattern**: Implemented via **Passport** strategies (JWT, Google, LinkedIn, API Key) to handle different authentication mechanisms interchangeably
- **Singleton Pattern**: By default, NestJS modules and services are singletons, ensuring efficient memory usage
- **DTO (Data Transfer Object)**: Defines the shape of data for incoming requests and outgoing responses, ensuring type safety and validation


## 🧪 Future Improvements
- **API Documentation**: Integrate **Swagger/OpenAPI** for auto-generated API docs
- **Real-time Communication**: Implement **WebSockets (Gateway)** for real-time notifications (replacing the current polling mechanism)
- **Caching**: Integrate **Redis** or In-memory cache for optimizing heavy database queries
- **Message Queue**: Implement **RabbitMQ** or **BullMQ** for handling background tasks (e.g., sending emails asynchronously)
- **Microservices**: Refactor modules into standalone microservices using gRPC or TCP
- **CI/CD**: Setup GitHub Actions for automated testing and deployment


## ⚙️ Environment Variables

Create a `.env` file:

```env
# --- App Config ---
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3001

# --- Security & Rate Limit ---
THROTTLE_TTL=60000
THROTTLE_LIMIT=10
API_KEY=your_secure_internal_api_key

# --- Database ---
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/your-db?appName=Cluster0
MONGO_POOL_SIZE=10

# --- JWT Config ---
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# --- OAuth 2.0 ---
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:3000/auth/linkedin/callback

# --- Cloudinary Storage ---
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

## ▶️ How To Run
```bash
npm install
npm run dev
npm run build
npm run start:dev
```

## 🐳 Run with Docker
```bash
# Development / Build & Run
docker-compose up -d --build

# Check Logs
docker-compose logs -f api

# Stop Containers
docker-compose down
```
### Docker Configuration
- **Dockerfile**: Uses a multi-stage build (Builder -> Runner) based on node:20-alpine for a lightweight and secure production image
- **docker-compose.yml**: Orchestrates the API service and a local MongoDB container
  - **API**: Runs on port 3000
  - **MongoDB**: Exposed on port 27017 (Data persisted in mongo_data volume)

## 📬 Contact
- Email: hodtduy.work@gmail.com
- Linked In: [hodangthaiduy](https://www.linkedin.com/in/duy-ho-dang-thai-a33159383/)  

---
### Thank you for checking this project!
Happy coding! 💻
