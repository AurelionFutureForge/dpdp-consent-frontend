# Contributing to DPDP Consent Management System - Frontend

Thank you for your interest in contributing to the DPDP Consent Management System frontend! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)
- [Getting Help](#getting-help)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/AurelionFutureForge/dpdp-consent-frontend
   cd dpdp-consent-frontend
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/AurelionFutureForge/dpdp-consent-frontend
   ```

## Development Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Git

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (if required):
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── (auth)/                 # Authentication pages (if any)
├── globals.css            # Global styles
├── layout.tsx             # Root layout
└── page.tsx               # Home/Landing page

components/
├── auth/                  # Authentication components
│   ├── google-login-button.tsx
│   ├── mfa-form.tsx
│   └── index.ts
└── ui/                    # Reusable UI components
    ├── button.tsx
    ├── input.tsx
    ├── label.tsx
    └── ...

lib/
└── utils.ts               # Utility functions

public/
└── preference_popup.svg   # Static assets
```

## Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Avoid using `any` type - prefer specific types or `unknown`
- Use interfaces for component props
- Export types and interfaces from component files
- Use React hooks properly with correct dependency arrays
- Handle errors appropriately with try-catch blocks

### React/Next.js Guidelines

- Use functional components with hooks
- Follow the Next.js App Router conventions
- Use `"use client"` directive only when necessary
- Implement proper loading and error states
- Use Next.js Image component for images
- Follow React best practices for performance

### Code Style

- Follow the existing code style and formatting
- Use meaningful variable and function names
- Write self-documenting code with clear logic
- Keep components small and focused (single responsibility)
- Use ESLint to check your code:
  ```bash
  npm run lint
  ```
- Build the project to check for errors:
  ```bash
  npm run build
  ```

### Component Naming

- Use PascalCase for component files: `GoogleLoginButton.tsx`, `MFAForm.tsx`
- Use kebab-case for utility files: `utils.ts`, `api-client.ts`
- Use camelCase for functions and variables: `handleSubmit`, `isLoading`

### Import Organization

- Group imports: React/Next.js, then external packages, then internal modules
- Use absolute imports with path aliases (`@/`)
- Sort imports alphabetically within groups

Example:
```typescript
"use client";

import React, { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { MFAForm } from "@/components/auth/mfa-form";
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistency with existing design system
- Use semantic color names from the theme
- Keep accessibility in mind (WCAG 2.1 AA compliance)

## Commit Guidelines

We follow conventional commit format for clear commit history:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools
- `ui`: UI/UX improvements

### Examples

```
feat(auth): add Google SSO authentication

- Add GoogleLoginButton component
- Implement OAuth flow
- Add error handling for auth failures

Closes #123
```

```
fix(ui): resolve mobile layout overflow issue

Fix horizontal scroll on mobile devices caused by
oversized illustration container.

Fixes #456
```

## Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**:
   - Write clean, tested code
   - Follow coding standards
   - Update documentation if needed
   - Ensure responsive design works

3. **Test your changes**:
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template
   - Include screenshots for UI changes
   - Link any related issues

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's coding standards
- [ ] Build completes without errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] UI is responsive across different screen sizes
- [ ] Accessibility standards are maintained
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow the conventional format
- [ ] Branch is up to date with `main`
- [ ] Screenshots included for UI changes

### PR Review Process

- PRs will be reviewed by maintainers
- Address any review feedback promptly
- Be open to suggestions and improvements
- Keep PRs focused and reasonably sized

## Testing

### Manual Testing

- Test on different screen sizes (mobile, tablet, desktop)
- Verify all interactive elements work correctly
- Check for accessibility with keyboard navigation
- Test in different browsers (Chrome, Firefox, Safari)

### Build Testing

```bash
# Build the project
npm run build

```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or screen recordings
- Environment details (Browser, OS, screen size)
- Console errors (if applicable)

### Feature Requests

For feature requests, please include:

- Clear description of the proposed feature
- Use case and motivation
- UI/UX mockups or wireframes (if applicable)
- Any alternatives considered

## Getting Help

- Check existing [Issues](https://github.com/AurelionFutureForge/dpdp-consent-frontend/issues)
- Review the [README.md](./README.md)
- Open a new issue for questions or problems
- Reach out to maintainers if needed

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

Thank you for contributing to DPDP Consent Management System! 🚀

**Built for the people by Aurelion Future Forge Private Limited**

