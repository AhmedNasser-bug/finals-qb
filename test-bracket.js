const content = `
import React from 'react';

interface ComplexProps {
  user: {
    id: string;
    profile: {
      name: string;
      avatar: string;
    };
  };
  onClick: () => void;
}

export const ComplexComponent = (props: ComplexProps) => {
  return <div>Test</div>;
}
`;

function extractInterface(content) {
  const interfaceRegex = /(?:interface|type)\s+\w*(?:Props)?\s*(?:=\s*)?\{/;
  const match = content.match(interfaceRegex);
  if (!match) return 'None specified or inline props';

  const startIndex = match.index + match[0].length - 1;
  let endIndex = -1;
  const stack = [];

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (char === '{') {
      stack.push('{');
    } else if (char === '}') {
      stack.pop();
      if (stack.length === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex !== -1) {
    return content.substring(startIndex + 1, endIndex).trim();
  }

  return 'None specified or inline props';
}

console.log(extractInterface(content));
