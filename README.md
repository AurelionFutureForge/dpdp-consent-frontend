
# Consent Management System

A modern, feature-rich consent management system built with **Next.js 14**, **Shadcn/ui**, **Tailwind CSS**, **TypeScript**, and **Zustand**. This application provides an intuitive interface for managing user consents, privacy preferences, and compliance requirements. With responsive design and clean UI, it offers a seamless experience for administrators and end-users.

---

## Features

- **Consent Management**: Comprehensive system for managing user consents and privacy preferences.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Modern UI Components**: Built using `shadcn/ui` for reusable and elegant components.
- **Authentication & Authorization**: Secure authentication system with NextAuth.js.
- **TypeScript Integration**: Ensures type safety throughout the application.
- **State Management**: Powered by `Zustand` for scalable and efficient state handling.
- **Utility-First Styling**: Styled with `Tailwind CSS` for rapid design iteration.

---

## Tech/Framework Used

- **Next.js 14** - React framework with App Router
- **Shadcn/ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Zustand** - Lightweight state management
- **NextAuth.js** - Authentication library
- **Axios** - HTTP client for API requests

---

## Starting the Project Locally

Follow these steps to get the project running on your local machine:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/AurelionFutureForge/dpdp-consent-frontend.git
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Folder Structure

Below is the actual folder structure of the project:

```
dpdp/
├── public/
│   ├── icon.ico
│   ├── logo.svg
│   └── registry/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Authentication routes
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (dashboard-routes)/        # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   └── layout.tsx
│   │   ├── api/                       # API routes
│   │   │   ├── auth/                  # NextAuth.js configuration
│   │   │   └── uploadthing/           # File upload endpoints
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin-panel/               # Admin panel components
│   │   ├── ui/                        # Shadcn/ui components
│   │   ├── providers/                 # Context providers
│   │   ├── auth-layout.tsx
│   │   └── mode-toggle.tsx
│   ├── hooks/                         # Custom React hooks
│   ├── lib/                           # Utility libraries
│   ├── module/                        # Feature modules
│   │   └── authentication/
│   ├── store/                         # Zustand stores
│   ├── types/                         # TypeScript type definitions
│   └── utils/                         # Utility functions
├── registry/                          # Component registry
├── scripts/                           # Build scripts
├── .env.local                         # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

### Usage Example for Consent Management

Here's an example of setting up the dashboard layout and a consent management page:

```tsx
// (dashboard-routes)/layout.tsx
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}

// (dashboard-routes)/dashboard/page.tsx
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function DashboardPage() {
  return (
    <ContentLayout title="Consent Dashboard">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Consent Management Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dashboard content for consent management */}
        </div>
      </div>
    </ContentLayout>
  );
}
```

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your fork:
   ```bash
   git push origin my-feature-branch
   ```
5. Submit a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## Contact

For any questions, issues, or feedback, feel free to reach out via GitHub issues.
# dpdp-consent-frontend
