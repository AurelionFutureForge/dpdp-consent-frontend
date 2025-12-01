# DPDP Consent Management System - Frontend

A modern, privacy-first frontend application for the **Digital Personal Data Protection (DPDP) Act, 2023** Consent Management System.

## Overview

The DPDP Consent Management System frontend is a user-centric web application built for managing digital personal data consent in compliance with India's Digital Personal Data Protection Act, 2023. This application provides an intuitive interface for users to authenticate and manage their consent preferences.

### Key Features

- **Modern UI/UX**: Clean, accessible interface built with Next.js and Tailwind CSS
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Multiple Authentication Methods**:
  - Multi-Factor Authentication (MFA) via email
  - Single Sign-On (SSO) with Google
- **Robust Error Handling**: Consistent backend error surfacing on the login page, including Google OAuth failures (temporary `/api/auth/error` store)
- **Role-Based Routing (Server-Side)**: Middleware-based redirects and route locks for System Admins vs Data Fiduciaries
- **Data Fiduciary Registration**: Guided registration flow with image upload & cropping
- **Privacy-First**: Built with privacy and data protection principles at its core
- **Accessibility**: WCAG 2.1 AA compliant for inclusive user experience
- **Government Compliant**: Designed for MEITY standards and DPDP Act compliance

## Tech Stack

### Core Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Radix UI primitives
- **Font**: Poppins (Google Fonts)
- **Icons**: Lucide React
- **State Management**: React Hooks

### Additional Tools

- **Package Manager**: npm
- **Code Quality**: ESLint
- **Build Tool**: Next.js Turbopack
- **CSS Processing**: PostCSS

## Project Structure

```
dpdp-consent-frontend/
├── app/
│   ├── (dashboard)/
│   │   ├── sys-admin/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   └── df/
│   │       ├── layout.tsx
│   │       └── dashboard/page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── error/route.ts    # Temporary store to surface OAuth errors to the UI
│   ├── df-register/
│   │   ├── _components/registration-form.tsx
│   │   └── page.tsx              # Data Fiduciary registration page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Landing/Login page
├── components/
│   ├── auth/
│   │   ├── google-login-button.tsx
│   │   ├── mfa-form.tsx
│   │   ├── otp-form.tsx
│   │   └── mfa-tabs.tsx
│   ├── providers/
│   │   └── theme-provider.tsx
│   └── ui/
│       ├── image-uploader.tsx    # UploadThing + crop flow for images (logo upload)
│       └── ...
├── lib/
│   ├── admin-menu-list.ts        # Admin sidebar menu model
│   ├── df-menu-list.ts           # DF sidebar menu model
│   └── parse-api-errors.ts       # Centralized API error parsing
├── services/
│   └── auth/
│       ├── api.ts                # login, data-fiduciary/register
│       └── types.ts              # typed APIs
├── middleware.ts                 # Re-export of proxy middleware
├── proxy.ts                      # Server-side role-based routing & auth gate
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: For version control

## Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AurelionFutureForge/dpdp-consent-frontend
   cd dpdp-consent-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server with hot-reload

# Production
npm run build            # Build optimized production bundle
npm run start            # Start production server

# Code Quality
npm run lint             # Check code for linting errors
```

## Features in Detail

### Authentication

The application supports two authentication methods:

1. **Multi-Factor Authentication (MFA)**:
   - Users enter their email address
   - Verification code is sent to the email
   - Secure token-based authentication

2. **Single Sign-On (SSO)**:
   - Google OAuth integration
   - One-click authentication
   - Secure and convenient

#### Error Surfacing for Google/NextAuth
- On OAuth failure (e.g., AccessDenied), the backend error message is stored temporarily via `POST /api/auth/error`.
- The login page detects `?error=AccessDenied`, fetches the most recent message from `GET /api/auth/error`, displays it, then cleans the URL.

#### Credentials (MFA) Flow
- `MFAForm` calls `POST /auth/login` with `{ email, type: "MFA" }` and stores `otp_id`, `email`, `expires_in` in a Zustand store.
- `OTPForm` submits `{ email, otp, otp_id }` to the NextAuth credentials provider which forwards to backend `/auth/verify-otp`.
- On success, JWT and session callbacks enrich session with `isSystemAdmin` and `dataFiduciaryId`.

### User Interface

- **Landing Page**: Clean, government-compliant design with:
  - DPDP-themed illustration
  - Clear authentication options
  - Error banner for OAuth failures
  - Government branding (MEITY)
  - Developer attribution

- **Responsive Design**:
  - Mobile-first approach
  - Tablet and desktop optimized
  - Touch-friendly interface

- **Accessibility & Multilingual Features**:
  The application is designed with WCAG 2.1 AA compliance as a core principle, ensuring an inclusive user experience for all users. Comprehensive keyboard navigation is implemented throughout the interface, with visible focus indicators, proper tab order, and keyboard shortcuts for form interactions. Screen reader compatibility is achieved through semantic HTML structure, comprehensive ARIA labels on interactive elements (including status badges, action buttons, and form controls), and proper landmark regions. Visual accessibility is maintained through high contrast color ratios, clear disabled states, and multiple visual indicators beyond color alone. The application leverages Radix UI primitives, which provide built-in accessibility features including focus management, keyboard navigation, and ARIA attribute handling. Mobile responsiveness is achieved through a mobile-first design approach, utilizing responsive breakpoints (sm, md, lg, xl) to create adaptive grid layouts and flexible containers that seamlessly transition from mobile to tablet to desktop views. Touch-friendly interface elements ensure adequate touch target sizes and appropriate spacing for mobile interactions. Multilingual support is built into the application architecture, with language configuration fields in the consent lifecycle API, translation metadata tracking, and a language selector UI in the consent notice page. The HTML lang attribute is properly set, and the system is architected to support internationalization through the LanguageConfig interface, which includes language codes and translation objects. Date formatting utilizes locale-aware methods, and the backend API supports multiple languages through the translations object structure. Error handling, loading states, and content structure all adhere to accessibility best practices, with clear error messages, skeleton loaders for perceived performance, and proper heading hierarchy throughout the application.

## Configuration

### Fonts

The application uses **Poppins** font family with weights:
- 400 (Regular)
- 500 (Medium)
- 600 (Semi-Bold)
- 700 (Bold)

Configured in `app/layout.tsx`:
```typescript
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
```

### Theme

The application uses a light mode design with:
- Clean white backgrounds
- Blue/Indigo gradient accents
- Government-appropriate color scheme
- Consistent spacing and typography

## Integration with Backend

This frontend is designed to work with the DPDP Consent Management System backend API. Configure the API endpoint in your environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure they pass:
   - Linting: `npm run lint`
   - Build: `npm run build`

3. **Commit your changes** (follow conventional commits):
   ```bash
   git commit -m "feat(scope): your commit message"
   ```

4. **Push and create a Pull Request**

For more details, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Role-Based Routing & Access Control

- Implemented entirely in `proxy.ts` (wired via `middleware.ts`).
- Behavior:
  - Unauthenticated users are redirected to `/` (except allowed routes like `/api/auth/*` and `/df-register`).
  - Authenticated users with `isSystemAdmin: true` are routed to `/sys-admin/*`; others to `/df/*`.
  - Access is enforced:
    - System Admins are blocked from `/df/*` (redirected to `/sys-admin`).
    - Data Fiduciaries are blocked from `/sys-admin/*` (redirected to `/df`).
  - Visiting `/` while authenticated redirects to the role-appropriate area (unless `?error=...`).

## Data Fiduciary Registration

- Path: `/df-register`
- Features:
  - Form with validation for organization details
  - Logo upload & crop via `components/ui/image-uploader.tsx`
  - Submits to `POST /data-fiduciary/register`
  - On success, shows a toast and returns to `/`

## Conventions

- Use `services/auth/types.ts` to define request/response types.
- Implement API calls in `services/auth/api.ts` using `axiosBase`.
- Use `lib/parse-api-errors.ts` to extract messages from failures.
- Keep client redirects minimal; prefer server-side redirects in `proxy.ts`.

## Compliance & Privacy

This application is designed to comply with the **Digital Personal Data Protection (DPDP) Act, 2023**:

- **Privacy by Design**: Privacy considerations built into every feature
- **Data Minimization**: Only collect essential user information
- **Transparency**: Clear communication about data usage
- **User Control**: Users have full control over their data and consent
- **Security**: Industry-standard security practices
- **Accessibility**: Inclusive design for all users

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using Vercel:

```bash
npm install -g vercel
vercel
```

### Other Platforms

This is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Azure Static Web Apps
- Self-hosted Node.js server

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Code of Conduct

This project adheres to a Code of Conduct. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for more details.

## License

Copyright 2025 Aurelion Future Forge Private Limited

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) for details.

## Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review the [CONTRIBUTING.md](./CONTRIBUTING.md) guide

## Acknowledgments

- **Ministry of Electronics and Information Technology (MeitY)** for DPDP Act guidelines
- **Government of India** for digital privacy initiatives
- Open source community for tools and libraries

---

**Developed by**: Aurelion Future Forge Private Limited
**Project**: DPDP Consent Management System - Frontend
**Compliance**: Digital Personal Data Protection (DPDP) Act, 2023

> "Built for the people by Aurelion Future Forge Private Limited"
# dpdp-consent-frontend

# DPDP Consent Management System (CMS) - Backend

A comprehensive, privacy-first consent management system built in compliance with the **Digital Personal Data Protection (DPDP) Act, 2023**.

## Overview

The DPDP Consent Management System (CMS) is a robust backend solution designed to help organizations comply with India's Digital Personal Data Protection Act, 2023. This system provides a complete framework for managing user consent, tracking data processing activities, ensuring data subject rights, and maintaining comprehensive audit logs.

### Key Benefits

- **Regulatory Compliance**: Built specifically for DPDP Act 2023 compliance
- **Privacy by Design**: Privacy controls integrated from the ground up
- **Scalable Architecture**: Designed to handle high-volume consent management
- **API-First**: RESTful APIs for easy integration with existing systems
- **Comprehensive Auditing**: Complete audit trail of all data processing activities

## Features

- **Consent Management**: Capture, store, and manage user consent records
- **Data Subject Rights**: Support for data access, rectification, erasure requests
- **Audit Logging**: Comprehensive logging of all data processing activities
- **Privacy by Design**: Built-in privacy controls and data minimization
- **Compliance Tracking**: Monitor and ensure DPDP Act compliance
- **API-First Architecture**: RESTful APIs for seamless integration
- **Scalable Design**: Horizontal scaling support for high-traffic scenarios
- **JWT Authentication**: Secure token-based authentication
- **Type Safety**: Full TypeScript implementation with runtime validation

## Tech Stack

### Core Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens)
- **Logging**: Winston
- **Testing**: Jest
- **API Documentation**: Swagger/OpenAPI

### Additional Tools

- **Code Quality**: ESLint
- **Process Manager**: Nodemon (development)
- **Build Tool**: TypeScript Compiler
- **Error Tracking**: Sentry (optional)

## Project Structure

```
src/
├── api/
│   └── v1/
│       ├── controllers/        # Request handlers
│       ├── interfaces/         # TypeScript interfaces
│       ├── middlewares/        # Auth and validation middleware
│       ├── routers/            # API routes
│       ├── services/           # Business logic
│       │   ├── consentService/     # Consent management
│       │   ├── dataSubjectService/ # Data subject rights handling
│       │   └── auditService/       # Audit logging
│       ├── utils/              # Utility functions
│       └── validations/        # Request validation schemas
├── config/                     # Global config
│   ├── env/                    # Environment variables
│   └── swagger/                # API documentation
├── prisma/                     # Database schema and migrations
└── server.ts                   # Entry point
```

## Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher (or yarn)
- **PostgreSQL**: v14 or higher
- **Git**: For version control

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd DPDP
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=8001
   HOST=0.0.0.0

   # PostgreSQL Database
   DATABASE_URL=postgresql://username:password@localhost:5432/dpdp_cms

   # JWT Authentication
   ACCESS_TOKEN_SECRET=your-secret-key-here
   ACCESS_TOKEN_EXPIRES_IN=1d

   # CORS Configuration
   CORS_ORIGIN=*
   ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-url.com
   ```

4. **Database Setup**:

   Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

   Push database schema:
   ```bash
   npm run prisma:push
   ```

   Or run migrations:
   ```bash
   npm run prisma:migrate
   ```

   (Optional) Open Prisma Studio to view database:
   ```bash
   npm run prisma:studio
   ```

5. **Verify Installation**:

   Run type checking:
   ```bash
   npm run typecheck
   ```

   Run linting:
   ```bash
   npm run lint
   ```

## Usage

### Development

Start the development server with hot-reload:
```bash
npm run dev
```

The server will start on `http://localhost:8001` (or the port specified in `.env`).

### Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

### API Documentation

Once the server is running, access the interactive API documentation at:
```
http://localhost:8001/api-docs
```

### Example API Usage

#### Health Check
```bash
curl http://localhost:8001/health
```

#### Authentication Example
```bash
# Login (example endpoint)
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Create Consent Record (example endpoint)
```bash
curl -X POST http://localhost:8001/api/v1/consent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "userId": "user-id",
    "purpose": "marketing",
    "consentGiven": true
  }'
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot-reload

# Testing
npm run test             # Run tests
npm run test:verbose     # Run tests with verbose output
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Check code for linting errors
npm run lint:fix         # Fix linting errors automatically
npm run typecheck        # Type check without compiling

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:reset     # Reset database (development only)

# Build & Production
npm run build            # Build for production
npm run start            # Start production server
npm run clean            # Clean build directory
```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure they pass:
   - Type checking: `npm run typecheck`
   - Linting: `npm run lint`
   - Tests: `npm run test`

3. **Commit your changes** (follow conventional commits):
   ```bash
   git commit -m "feat(scope): your commit message"
   ```

4. **Push and create a Pull Request**

For more details, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Architecture Details

This project uses a modern, privacy-first architecture with the following principles:

- **Type Safety**: Full TypeScript implementation with Prisma for database types
- **Runtime Validation**: Zod schemas for request/response validation
- **Functional Programming**: Clean, testable code organization
- **Separation of Concerns**: Controllers, services, and data access layers
- **Error Handling**: Centralized error handling middleware
- **Security First**: Helmet, CORS, and rate limiting built-in

## Key Services

- **Consent Service**: Manages user consent capture, storage, and retrieval
- **Data Subject Service**: Handles data subject rights requests (access, rectification, erasure)
- **Audit Service**: Comprehensive logging and tracking of all data processing activities
- **Authentication Service**: Secure JWT-based authentication and authorization

## Compliance & Privacy

The application is designed to comply with the **Digital Personal Data Protection (DPDP) Act, 2023**:

- **Consent Management**: Explicit consent capture and tracking
- **Data Minimization**: Only collect and process necessary data
- **Purpose Limitation**: Process data only for specified purposes
- **Storage Limitation**: Retain data only as long as necessary
- **Transparency**: Clear documentation of data processing activities
- **Security**: Robust security measures to protect personal data
- **Data Subject Rights**: Support for all rights under DPDP Act

## Scaling

The application supports horizontal scaling through:
- Stateless API design with PostgreSQL
- Connection pooling for database efficiency
- Modular service architecture
- RESTful API design for easy integration

## Contributing

Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Code of Conduct

This project adheres to a Code of Conduct. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for more details.

## License

ISC

---

**Developed by**: Aurelion Future Forge Private Limited
**Project**: DPDP Consent Management System (CMS)
**Compliance**: Digital Personal Data Protection (DPDP) Act, 2023