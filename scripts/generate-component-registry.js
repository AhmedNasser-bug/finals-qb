const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if(file !== 'node_modules' && file !== '.next') {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const components = walkSync('./components');
const appFiles = walkSync('./app');

const allFiles = [...appFiles, ...components];

const extractProps = (content) => {
  const interfaceMatch = content.match(/interface\s+\w+Props\s*{([^}]+)}/);
  if (interfaceMatch) {
    return interfaceMatch[1].trim();
  }

  const typeMatch = content.match(/type\s+\w+Props\s*=\s*{([^}]+)}/);
  if (typeMatch) {
    return typeMatch[1].trim();
  }

  // Look for inline props
  const inlinePropMatch = content.match(/function\s+\w+\s*\(\s*{\s*([^}]+)\s*}\s*:\s*{[^}]+}/);
  if (inlinePropMatch) {
    return inlinePropMatch[1].trim();
  }

  return 'None';
};

const hasClientDirective = (content) => {
  return content.includes('"use client"') || content.includes("'use client'");
};

const hasChildren = (content) => {
  return content.includes('children') || content.includes('ReactNode');
};

const usesRouting = (content) => {
  return content.includes('useRouter') || content.includes('usePathname') || content.includes('useSearchParams') || content.includes('next/navigation');
};

const isLazyLoaded = (content) => {
  return content.includes('next/dynamic') || content.includes('dynamic(');
};

const extractHooks = (content) => {
  const hooks = new Set();
  const hookRegex = /use[A-Z]\w+/g;
  let match;
  while ((match = hookRegex.exec(content)) !== null) {
    hooks.add(match[0]);
  }
  return Array.from(hooks).sort().join(', ') || 'None';
};

const getPerformanceCharacteristics = (content) => {
  const usesMemo = content.includes('useMemo');
  const usesCallback = content.includes('useCallback');

  if (usesMemo || usesCallback) {
    const methods = [];
    if (usesMemo) methods.push('useMemo');
    if (usesCallback) methods.push('useCallback');
    return `Utilizes memoization: ${methods.join(', ')} to prevent unnecessary re-renders.`;
  }

  return 'No explicit memoization hooks (useMemo/useCallback) used.';
};

const getEdgeCases = (content) => {
  const edgeCases = [];

  if (content.includes('localStorage') || content.includes('sessionStorage')) {
    edgeCases.push('- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.');
  }

  if (content.includes('JSON.parse')) {
    edgeCases.push('- Parses arbitrary JSON payloads; requires strict try/catch blocks and subsequent structural validation (e.g., Zod schemas) to prevent prototype pollution or invalid state.');
  }

  if (content.includes('existingIds')) {
    edgeCases.push('- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.');
  }

  if (content.includes('className')) {
    edgeCases.push('- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.');
  }

  if (content.includes('role="alert"') || content.includes('ErrorBoundary')) {
    edgeCases.push('- Implements explicit fallback UIs for critical asynchronous or failing boundaries.');
  }

  if (content.includes('DOMPurify')) {
      edgeCases.push('- Sanitizes raw user input via DOMPurify to mitigate XSS attacks during HTML interpolation.');
  }

  if (content.includes('mermaid')) {
      edgeCases.push('- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.');
  }

  if (content.includes('onClick') && content.includes('button')) {
      edgeCases.push('- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.');
  }

  if (edgeCases.length === 0) {
    edgeCases.push('- Pure presentation component. Minimal edge cases aside from standard prop type validations.');
  }

  return edgeCases.join('\n');
};

let markdown = `
# MOLD V2 Component Registry & Developer Guide

This document serves as an automated registry of all UI modules and core libraries, specifying exact properties, state dependencies, performance characteristics, and routing/hydration behaviors. It also outlines explicit edge-case input handling and validation rules for seamless developer onboarding.

## Architecture & Hydration Overview

### Routing States
- **Root Route (\`/\`)**: Manages the active study session. It reads the active subject from \`sessionStorage\` (\`mold_v2_active_subject\`). If found, it hydrates the \`HomeScreen\`. If not, it redirects to \`/subjects\`.
- **Subjects Route (\`/subjects\`)**: Manages subject selection, importation, and sharing. Handles share links via URL hash detection (\`#share=...\`) and transitions gracefully between \`loading\`, \`receiving\`, and \`selecting\` states.

### Client-side Hydration & Lazy-Loading Logic
- Components like complex editors or heavy visualizers may utilize \`next/dynamic\` for client-side lazy-loading to reduce initial bundle size.
- State is hydrated synchronously from storage providers (e.g., \`localStorage\`) during \`useEffect\` hooks, utilizing a \`ready\` or \`loading\` state flag to prevent Server-Side Rendering (SSR) mismatch errors.
- Dynamic loading configurations strictly ensure fallbacks are rendered while assets are being parsed and loaded.

### Asset Delivery Configurations
- The framework uses **Next.js (Turbopack)** with explicitly disabled Image optimization (\`unoptimized: true\` in \`next.config.mjs\`) to accommodate static exports (\`output: export\`) and distinct custom asset pipelines.
- Content hydration relies on local state management and persistence without depending heavily on backend databases. Asset streaming and manifest resolution handles I/O operations concurrently where applicable.

### Edge-case Input Handling & Validation Rules
- **Subject Validation (\`lib/mold-types.ts\`)**: Rigorous validation ensures imported schemas adhere to strict standards. \`multipleChoice\` options must be an array of objects containing a \`label\` string, and flashcards must define \`term\` and \`definition\` properties (preventing legacy formatting breaks).
- **Data Hydration Failures**: Fallback to empty states or onboarding flows when storage (\`localStorage\`/\`sessionStorage\`) is unavailable or heavily corrupted.
- **Error Boundaries (\`GameErrorBoundary\`)**: Implements \`role="alert"\` and fallback UIs to gracefully capture, report, and recover from render-phase failures within interactive components.
- **Circular References (\`logger.ts\`)**: Deep traversal and masking algorithms use \`WeakSet\` caching mechanisms to safely evaluate potentially recursive, deeply-nested error states to prevent stack overflows.

## Component Registry

# Frontend Component Registry & Developer Guide

This document serves as a comprehensive registry for the modern frontend architecture. It outlines component APIs, content hydration pipelines, state dependencies, performance characteristics, and routing/lazy-loading logic.

## 1. Core Architecture & Hydration Pipelines

The application uses Next.js with React Server Components where applicable, but primarily relies on Client Components (\`"use client"\`) for interactive UI. State management utilizes a combination of React hooks, context (\`AchievementProvider\`), and local/session storage for persistence.

### 1.1 State Dependencies
Global state like active subjects is managed through \`active-subject-store.ts\` and \`subject-store.ts\`. Real-time game engine state is driven by custom hooks like \`useGameEngine\`.

### 1.2 Asset Delivery & Lazy Loading
The application leverages Next.js optimizations. No explicit \`next/dynamic\` calls are currently used for components; standard Next.js routing handles code splitting at the page level.

### 1.3 Routing States
Routing is managed via Next.js App Router. Components utilizing routing hooks (\`useRouter\`, \`useSearchParams\`) are documented below.

## 2. Component Registry

`;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getModuleName = (filepath) => {
    const base = path.basename(filepath, path.extname(filepath));
    if (base === 'page' || base === 'layout') {
        const dir = path.dirname(filepath).split(path.sep).pop();
        if (dir === 'app') {
            return base === 'page' ? 'Home' : 'RootLayout';
        }
        return capitalize(dir) + capitalize(base);
    }
    return base.split('-').map(capitalize).join('-');
};

allFiles.sort().forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');

  // Skip purely type files or config files for brevity
  if (file.endsWith('.d.ts') || file.includes('components.json')) return;

  const moduleName = getModuleName(file);
  const isClient = hasClientDirective(content);
  const hasSlot = hasChildren(content);
  const usesRoute = usesRouting(content);
  const lazyLoad = isLazyLoaded(content);
  const hooks = extractHooks(content);
  const performance = getPerformanceCharacteristics(content);
  const props = extractProps(content);
  const edgeCases = getEdgeCases(content);

  markdown += `### \`${file}\`\n\n`;
  markdown += `**Module Name:** ${moduleName}\n\n`;
  markdown += `**Characteristics:**\n`;
  markdown += `- Client Component: \`${isClient ? 'Yes' : 'No'}\`\n`;
  markdown += `- Supports Slots (children): \`${hasSlot ? 'Yes' : 'No'}\`\n`;
  markdown += `- Uses Routing: \`${usesRoute ? 'Yes' : 'No'}\`\n`;
  markdown += `- Dynamic Lazy-Loading: \`${lazyLoad ? 'Yes' : 'No'}\`\n\n`;
  markdown += `**State Dependencies (Hooks):**\n${hooks}\n\n`;
  markdown += `**Performance Characteristics:**\n${performance}\n\n`;
  markdown += `**Properties & Slots (Interface):**\n\`\`\`typescript\n${props}\n\`\`\`\n\n`;
  markdown += `**Edge-Case Input Handling & Validation:**\n${edgeCases}\n\n---\n\n`;
});

fs.writeFileSync('docs/architecture/component-registry.md', markdown);
console.log('Component registry generated at docs/architecture/component-registry.md');
