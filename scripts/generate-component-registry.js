const fs = require('fs');
const path = require('path');

const UI_DIR = path.join(__dirname, '../components');
const APP_DIR = path.join(__dirname, '../app');
const OUTPUT_FILE = path.join(__dirname, '../docs/architecture/component-registry.md');

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanDirectory(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function extractInterface(content, componentName) {
  // Fix interface regex extraction to handle brackets
  const interfaceMatch = content.match(/interface\s+\w*(?:Props)?\s*\{([\s\S]*?)\n\}/) ||
                         content.match(/type\s+\w*(?:Props)?\s*=\s*\{([\s\S]*?)\n\}/);
  if (interfaceMatch) {
    return interfaceMatch[1].trim();
  }
  return 'None specified or inline props';
}

async function processComponent(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const content = chunks.join('');

  const fileName = path.basename(filePath);
  const parts = fileName.replace('.tsx', '').split('-');
  const length = parts.length;
  const words = new Array(length);
  for (let i = 0; i < length; i++) {
    const w = parts[i];
    words[i] = w.charAt(0).toUpperCase() + w.slice(1);
  }
  const moduleName = words.join('-');

  const isClient = content.includes('"use client"') || content.includes("'use client'");
  const hasChildren = content.includes('children') || content.includes('ReactNode');
  const usesRouting = content.includes('useRouter') || content.includes('next/navigation') || content.includes('next/link');
  const isLazyLoaded = content.includes('next/dynamic') || content.includes('lazy(');

  const hooksMatch = content.match(/use[A-Z]\w+/g);
  const hooks = hooksMatch ? Array.from(new Set(hooksMatch)).sort() : [];
  const stateHooks = hooks.filter(h => h !== 'useMemo' && h !== 'useCallback');

  const hasUseMemo = content.includes('useMemo');
  const hasUseCallback = content.includes('useCallback');

  let perf = "No explicit memoization hooks (useMemo/useCallback) used.";
  if (hasUseMemo && hasUseCallback) {
    perf = "Utilizes memoization: useMemo and useCallback to prevent unnecessary re-renders.";
  } else if (hasUseMemo) {
    perf = "Utilizes memoization: useMemo to prevent unnecessary re-renders.";
  } else if (hasUseCallback) {
    perf = "Utilizes memoization: useCallback to prevent unnecessary re-renders.";
  }

  const propsStr = extractInterface(content, moduleName);

  let edgeCases = [];
  if (content.includes('className')) {
    edgeCases.push("Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.");
  }
  if (content.includes('existingIds')) {
    edgeCases.push("Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.");
  }
  if (content.includes('DOMPurify') || content.includes('isomorphic-dompurify')) {
    edgeCases.push("Sanitizes raw user input via DOMPurify to mitigate XSS attacks during HTML interpolation.");
  }
  if (content.includes('JSON.parse')) {
    edgeCases.push("Parses arbitrary JSON payloads; requires strict try/catch blocks and subsequent structural validation (e.g., Zod schemas) to prevent prototype pollution or invalid state.");
  }
  if (content.includes('localStorage') || content.includes('sessionStorage')) {
    edgeCases.push("Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.");
  }
  if (content.includes('ErrorBoundary')) {
    edgeCases.push("Implements explicit fallback UIs for critical asynchronous or failing boundaries.");
  }
  if (content.includes('onClick') || content.includes('onChange')) {
    edgeCases.push("Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.");
  }
  if (content.includes('mermaid')) {
    edgeCases.push("Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.");
  }
  if (edgeCases.length === 0) {
    edgeCases.push("Pure presentation component. Minimal edge cases aside from standard prop type validations.");
  }

  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  return `
### \`${relativePath}\`

**Module Name:** ${moduleName}

**Characteristics:**
- Client Component: \`${isClient ? 'Yes' : 'No'}\`
- Supports Slots (children): \`${hasChildren ? 'Yes' : 'No'}\`
- Uses Routing: \`${usesRouting ? 'Yes' : 'No'}\`
- Dynamic Lazy-Loading: \`${isLazyLoaded ? 'Yes' : 'No'}\`

**State Dependencies (Hooks):**
${stateHooks.length > 0 ? stateHooks.join(', ') : 'None'}

**Performance Characteristics:**
${perf}

**Properties & Slots (Interface):**
\`\`\`typescript
${propsStr}
\`\`\`

**Edge-Case Input Handling & Validation:**
${edgeCases.map(e => '- ' + e).join('\n')}
`;
}

async function generateDocs() {
  const allFiles = [...scanDirectory(UI_DIR), ...scanDirectory(APP_DIR)];
  const tsxFiles = allFiles.filter(f => f.endsWith('.tsx')).sort();

  const componentDocs = [];
  for (const file of tsxFiles) {
    const doc = await processComponent(file);
    componentDocs.push(doc);
  }

  const markdown = `# Component Registry

*This document is automatically generated by \`scripts/generate-component-registry.js\`. Do not edit directly.*

## Overview
This registry outlines the exact properties, slots, state dependencies, and performance characteristics of each UI module. It also documents the client-side lazy-loading logic, asset delivery configurations, and routing states.

## Architecture Guidelines

### Routing States
- **App Router:** Utilizes Next.js App Router for strict server-components by default.
- **Client Hydration:** Interactive islands and global state providers are explicitly marked with \`"use client"\` to cleanly split static and hydrated content.
- **Hash Routing:** The \`/subjects\` route handles subject selection, importation, and processes share links via URL hash detection (\`#share=...\`).

### Client-Side Lazy-Loading & Asset Delivery
- Next.js dynamic imports (\`next/dynamic\`) are employed for complex or heavy UI segments (e.g., Mermaid diagram visualizers) to optimize initial paint payload sizes.
- Static assets (images, icons) are delivered via the Next.js optimized asset pipeline where possible, or directly inlined if SVG.
- UI chunks are split automatically via Turbopack per route and dynamically loaded on route transition.

## Component Definitions
${componentDocs.join('\n')}
`;

  fs.writeFileSync(OUTPUT_FILE, markdown);
  console.log(`Generated component registry at ${OUTPUT_FILE}`);
}

generateDocs();
