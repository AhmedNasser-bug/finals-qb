# Frontend Client Apps & Next.js App Router

The frontend application uses Next.js 16 with the App Router.

- `app/layout.tsx`: The root layout of the application, managing global styles and context providers. It serves as the primary Server Component boundary.
- `app/page.tsx`: The home page module where initial routing and interaction happens. Contains the core mode selector and layout components.
- `app/subjects/page.tsx`: Subject management page for reviewing active and available subjects.
- Domain-specific components are localized in `components/mold/` (e.g. `HomeScreen`, `GameRunner`, `SubjectImporter`).

## Interaction Flow
1. Next.js server components render the skeleton.
2. The user interacts with Client Components. Contexts from `lib/game-engine.tsx` and stores like `lib/active-subject-store.ts` mutate based on actions.
3. Persistent states sync down into `localStorage` leveraging persistence controllers.
