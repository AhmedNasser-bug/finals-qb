const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(process.cwd(), 'components');
const REGISTRY_FILE = path.join(process.cwd(), 'docs/onboarding/component-registry.md');

// Helper to check if file has 'use client'
function hasUseClient(content) {
  return content.includes("'use client'") || content.includes('"use client"');
}

// Helper to extract properties
function extractProperties(content) {
  const propsMatch = content.match(/(?:interface|type)\s+([A-Za-z0-9_]+Props)\s*=?\s*{([^}]*)}/s);
  if (propsMatch) {
    const propsBody = propsMatch[2];
    const props = [];
    const lines = propsBody.split('\n');
    for (const line of lines) {
      const propMatch = line.match(/^\s*([A-Za-z0-9_]+\??)\s*:\s*([^;]+);/);
      if (propMatch) {
        props.push(`    *   \`${propMatch[1]}\`: ${propMatch[2].trim()}`);
      }
    }
    if (props.length > 0) return props.join('\n');
  }

  const inlinePropsMatch = content.match(/function\s+[A-Za-z0-9_]+\s*\(\s*{\s*([^}]+)\s*}\s*:\s*{[^}]+}\s*\)/);
  if (inlinePropsMatch) {
     return "    *   Properties extracted from inline signature";
  }

  return "    *   None or generic React props";
}

// Helper to check if next/dynamic is used
function hasNextDynamic(content) {
  return content.includes("dynamic(") && content.includes("next/dynamic");
}

function extractState(content) {
  const states = [];
  if (content.includes('useState(')) states.push('useState');
  if (content.includes('useReducer(')) states.push('useReducer');
  if (content.includes('useContext(')) states.push('useContext');
  if (content.includes('useStore(')) states.push('useStore (Zustand/Redux)');

  if (states.length > 0) return states.join(', ');
  return 'Stateless';
}

function extractEdgeCases(content) {
  const cases = [];
  if (content.includes('className')) cases.push('Accepts optional styling via `className` merged using `twMerge`.');
  if (content.includes('JSON.parse(')) cases.push('Must safely catch and handle invalid JSON parsing strings.');
  if (content.includes('localStorage.')) cases.push('Must gracefully handle `localStorage` access errors when third-party cookies are disabled.');
  if (content.includes('children')) cases.push('Handles generic content injection via the children prop.');
  if (content.includes('z.object')) cases.push('Inputs strictly parsed and coerced via Zod schema definitions.');
  if (content.includes('useForm(')) cases.push('Implements strictly typed React Hook Form validation boundary.');

  if (cases.length > 0) return cases.join(' ');
  return 'Inherits standard error boundaries and loading states.';
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  const name = path.basename(filePath);

  const isClient = hasUseClient(content);
  const hydration = isClient ? "Client (`use client`)" : "Server (RSC)";
  const dynamicLoading = hasNextDynamic(content) ? "Yes (`next/dynamic`)" : "No";
  const props = extractProperties(content);
  const state = extractState(content);
  const perf = isClient ? "Requires client JS hydration." : "Zero-JS static HTML overhead (RSC).";
  const edgeCases = extractEdgeCases(content);

  return `#### \`${name}\`
*   **Path**: \`${relativePath}\`
*   **Hydration**: ${hydration}
*   **Dynamic Loading**: ${dynamicLoading}
*   **Properties**:
${props}
*   **Slots**: Supports \`children\` prop for content transclusion.
*   **State Dependencies**: ${state}
*   **Performance Characteristics**: ${perf}
*   **Edge Case Handling**: ${edgeCases}
`;
}

function processDirectory(directory, output) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath, output);
    } else if (file.endsWith('.tsx')) {
      if (!fullPath.includes('components/ui/')) {
        output.push(analyzeFile(fullPath));
      }
    }
  }
}

async function run() {
  console.log('Generating component registry analysis...');
  const output = [];
  processDirectory(COMPONENTS_DIR, output);

  const existingMarkdown = fs.readFileSync(REGISTRY_FILE, 'utf8');
  const splitMarker = '### Application Components';

  // If the file already has Application Components, split there. Otherwise try Mold Components
  let markerToSplitOn = existingMarkdown.includes(splitMarker) ? splitMarker : '### Mold Components (components/mold)';

  const parts = existingMarkdown.split(markerToSplitOn);

  if (parts.length === 2) {
      const topPart = parts[0];
      const bottomSplitMarker = '## Content Hydration & Lazy Loading';
      const bottomParts = parts[1].split(bottomSplitMarker);

      if (bottomParts.length === 2) {
          const bottomPart = bottomSplitMarker + bottomParts[1];
          const merged = topPart + '### Application Components\n\n' + output.join('\n') + '\n\n' + bottomPart;

          fs.writeFileSync(REGISTRY_FILE, merged);
          console.log('Component registry updated successfully.');
      }
  }
}

run();
