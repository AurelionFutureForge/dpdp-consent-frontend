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
│   ├── globals.css           # Global styles and Tailwind configuration
│   ├── layout.tsx            # Root layout with fonts and metadata
│   └── page.tsx              # Landing/Login page
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── google-login-button.tsx
│   │   ├── mfa-form.tsx
│   │   └── index.ts
│   └── ui/                   # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── ...
├── lib/
│   └── utils.ts              # Utility functions (cn, etc.)
├── public/
│   └── preference_popup.svg  # Illustration assets
├── CODE_OF_CONDUCT.md        # Community guidelines
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # Apache 2.0 License
└── README.md                 # This file
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

### User Interface

- **Landing Page**: Clean, government-compliant design with:
  - DPDP-themed illustration
  - Clear authentication options
  - Government branding (MEITY)
  - Developer attribution

- **Responsive Design**:
  - Mobile-first approach
  - Tablet and desktop optimized
  - Touch-friendly interface

- **Accessibility**:
  - Keyboard navigation support
  - Screen reader compatible
  - High contrast ratios
  - Semantic HTML

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
