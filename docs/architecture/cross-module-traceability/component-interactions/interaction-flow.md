### Interaction Flow
1. Next.js server components render the skeleton.
2. The user interacts with Client Components. Contexts from `lib/game-engine.tsx` and stores like `lib/active-subject-store.ts` mutate based on actions.
3. Persistent states sync down into `localStorage` leveraging persistence controllers.

### Component Interaction Mapping
- **Frontend App ↔ Local Storage**: Client components read/write to `localStorage` using hooks like `useSubjectStore` and persistent state managers to ensure offline availability.
- **Backend Services**: Next.js Server Components handle secure, pre-rendered HTML delivery. Server Actions (if any) provide structured API points.
- **Docker Multi-Tenant Sandbox**: Containerized tenants mount isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) avoiding state bleeding across the local orchestrator environments.