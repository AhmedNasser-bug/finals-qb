# System Overview & Traceability

**This document maps the architectural component interactions across frontend client apps, backend services, and cloud infra targets.**

## Frontend Client Apps & Next.js App Router
The frontend application uses **Next.js 16** with the App Router.
- **`app/layout.tsx`**: The root layout of the application, managing global styles and context providers.
- **`app/page.tsx`**: The home page module where initial routing and interaction happens.
- **`app/subjects/page.tsx`**: Subject management page.
- **Domain-Specific Components**: Localized in `components/mold/` (e.g. `HomeScreen`, `GameRunner`, `SubjectImporter`).

## Component Interaction Mapping
- **Frontend App ↔ Local Storage**: Client components read/write to `localStorage` using hooks like `useSubjectStore` and persistent state managers to ensure offline availability.
- **Backend Services**: Next.js Server Components handle secure, pre-rendered HTML delivery. Server Actions provide structured API points.
