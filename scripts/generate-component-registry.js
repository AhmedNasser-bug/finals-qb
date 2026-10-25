const fs = require('fs');
const path = require('path');
const COMPONENTS_DIR = path.join(__dirname, '../components');
const DOCS_FILE = path.join(__dirname, '../docs/onboarding/component-registry.md');
const getAllFiles = function(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  return arrayOfFiles;
};
const getComponentName = (filePath) => path.basename(filePath);
const analyzeFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    const isClient = content.includes("'use client'") || content.includes('"use client"');
    const hydration = isClient ? "Client (`use client`)" : "Server (RSC)";
    const isDynamic = content.includes('dynamic(') && content.includes('ssr: false');
    const dynamicLoading = isDynamic ? "Yes (`next/dynamic`)" : "No";
    let props = "None explicitly defined.";
    const propsMatch = content.match(/interface\s+(\w+Props)\s*{([^}]*)}/s) || content.match(/type\s+(\w+Props)\s*=\s*{([^}]*)}/s);
    if (propsMatch) {
       const propLines = propsMatch[2].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
       if (propLines.length > 0) {
           props = propLines.map(p => {
               const parts = p.split(':');
               if (parts.length > 1) {
                   return `\`${parts[0].trim()}\`: ${parts.slice(1).join(':').replace(/[,;]$/, '').trim()}`;
               }
               return `\`${p}\``;
           }).join(', ');
       }
    }
    const hasChildren = content.includes('children') || content.includes('ReactNode');
    const slots = hasChildren ? "Supports `children` prop for content transclusion." : "None explicitly defined.";
    const hasUseState = content.includes('useState(');
    const hasUseReducer = content.includes('useReducer(');
    const stateDeps = [];
    if (hasUseState) stateDeps.push('useState');
    if (hasUseReducer) stateDeps.push('useReducer');
    const stateStr = stateDeps.length > 0 ? stateDeps.join(', ') : "Stateless";
    let perf = isClient ? "Requires client JS hydration." : "Zero-JS static HTML overhead (RSC).";
    if (content.includes('memo(')) perf += " Wrapped in React.memo for render optimization.";
    let edgeCases = [];
    if (content.includes('role="status"') || content.includes('aria-live')) edgeCases.push("Implements ARIA live regions for accessibility.");
    if (content.includes('tabIndex={-1}')) edgeCases.push("Implements programmatic focus management.");
    if (content.includes('ErrorBoundary')) edgeCases.push("Implements explicit React ErrorBoundary.");
    if (content.includes('Suspense')) edgeCases.push("Uses React Suspense for loading state.");
    let edgeCasesStr = edgeCases.length > 0 ? edgeCases.join(" ") : "None explicitly detected.";
    return `\n#### \`${getComponentName(filePath)}\`\n*   **Path**: \`${relativePath}\`\n*   **Hydration**: ${hydration}\n*   **Dynamic Loading**: ${dynamicLoading}\n*   **Properties**: ${props}\n*   **Slots**: ${slots}\n*   **State Dependencies**: ${stateStr}\n*   **Performance Characteristics**: ${perf}\n*   **Edge Case Handling**: ${edgeCasesStr}\n`;
};
const generateRegistryContent = (files) => {
    let content = `# Frontend Component Registry\n\nThis document provides an automated component registry documentation file that specifies the exact properties, slots, state dependencies, and performance characteristics of each UI module. It also documents the client-side lazy-loading logic, asset delivery configurations, and routing states.\n\n## Table of Contents\n\n1. [UI Modules](#ui-modules)\n2. [Content Hydration & Lazy Loading](#content-hydration--lazy-loading)\n3. [Routing States](#routing-states)\n4. [Edge-Case Input Handling & Validation Rules](#edge-case-input-handling--validation-rules)\n\n## UI Modules\n`;
    const groups = {};
    files.forEach(f => {
        let dir = path.dirname(f);
        let groupName = path.relative(COMPONENTS_DIR, dir);
        if (groupName === '') groupName = 'Root Components';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(f);
    });
    Object.keys(groups).sort().forEach(group => {
        const title = group.replace(/\\/g, '/').split('/').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' / ');
        content += `\n### ${title}\n`;
        groups[group].sort().forEach(f => {
            content += analyzeFile(f);
        });
    });
    return content;
};
try {
    let existingDocs = '';
    if (fs.existsSync(DOCS_FILE)) {
        existingDocs = fs.readFileSync(DOCS_FILE, 'utf-8');
    }
    const uiPrimitivesStart = existingDocs.indexOf('### UI Primitives (components/ui)');
    let uiPrimitivesContent = '';
    if (uiPrimitivesStart !== -1) {
       const nextHeading = existingDocs.indexOf('\n### ', uiPrimitivesStart + 1);
       if (nextHeading !== -1) {
           uiPrimitivesContent = existingDocs.substring(uiPrimitivesStart, nextHeading);
       } else {
           const endSection = existingDocs.indexOf('\n## Content Hydration & Lazy Loading', uiPrimitivesStart);
           if (endSection !== -1) {
               uiPrimitivesContent = existingDocs.substring(uiPrimitivesStart, endSection);
           }
       }
    }
    const tailSectionStart = existingDocs.indexOf('\n## Content Hydration & Lazy Loading');
    let tailSectionContent = '';
    if (tailSectionStart !== -1) {
       tailSectionContent = existingDocs.substring(tailSectionStart);
    }
    const allComponentFiles = getAllFiles(COMPONENTS_DIR);
    const filteredComponentFiles = allComponentFiles.filter(f => !f.includes('components/ui/'));
    let newDocs = generateRegistryContent(filteredComponentFiles);
    if (uiPrimitivesContent) {
       newDocs = newDocs.replace('## UI Modules', '## UI Modules\n\n' + uiPrimitivesContent);
    }
    if (tailSectionContent) {
        newDocs += tailSectionContent;
    }
    fs.writeFileSync(DOCS_FILE, newDocs);
    console.log("Successfully generated component registry.");
} catch (error) {
    console.error("Error generating component registry:", error);
}
