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
- **Health Checks**: `/health` endpoint for Liveness/Readiness probes (Docker/K8s friendly).
- **File Storage**: Seamless integration with **Cloudinary** for media assets.
- **Global Error Handling**: Standardized API Responses and Exception Filters.

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
- **Repository Pattern**: Abstracting DB operations (BaseRepository) to keep business logic clean
- **Factory Pattern**: PaymentManager selects the correct payment provider (Stripe/VNPay) at runtime
- **Strategy Pattern**: IPaymentGateway ensures all payment providers implement the same methods
- **Decorator Pattern**: @Cacheable for transparent Redis caching
- **Singleton**: Database connections and Service instances

## 🧪 Future Improvements
- Unit tests (Jest)
- Integration tests
- Role-based access control
- Refresh token flow
- Message queue (RabbitMQ / Kafka)
- API documentation (Swagger)


## ⚙️ Environment Variables

Create a `.env` file:

```env
# --- App Config ---
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000

# --- Database ---
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/your-db
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_PREFIX=express-toolkit:

# --- Security ---
API_KEY=your_internal_api_key
ACCESS_TOKEN_SECRET=your_super_secret_access_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# --- Cloudinary ---
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# --- OAuth ---
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/api/v1/auth/google/callback

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=/api/v1/auth/linkedin/callback

# --- Email ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# --- Payments ---
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_API_VERSION=2024-04-10

# VNPay (Sandbox)
VNP_TMN_CODE=your_tmn_code
VNP_HASH_SECRET=your_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5000/api/v1/payments/vnpay-return
```

## ▶️ How To Run
```bash
npm install
npm run dev
npm run build
npm run start
```

## 🐳 Run with Docker
```bash
# Build and start services
docker-compose up --build

# Stop services
docker-compose down
```

## 📬 Contact
- Email: hodtduy.work@gmail.com
- Linked In: [hodangthaiduy](https://www.linkedin.com/in/duy-ho-dang-thai-a33159383/)  

---
### Thank you for checking this project!
Happy coding 💻
