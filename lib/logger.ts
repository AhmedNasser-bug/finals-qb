const PII_PATTERNS = [
  {
    // Emails
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: '[REDACTED]'
  },
  {
    // Bearer tokens
    pattern: /(Bearer\s+)[A-Za-z0-9\-\._~\+\/]+=*/g,
    replacement: '$1[REDACTED]'
  },
  {
    // Private keys
    pattern: /-----BEGIN[\s\w]+PRIVATE KEY-----[\s\S]+?-----END[\s\w]+PRIVATE KEY-----/g,
    replacement: '[REDACTED]'
  },
  {
    // Common secrets
    pattern: /((?:api_key|apikey|secret|token|password)["']?\s*[:=]\s*["']?)([^"'\s\,\]\}]+)/gi,
    replacement: '$1[REDACTED]'
  },
  {
    // JWTs
    pattern: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
    replacement: '[REDACTED]'
  }
];

function maskString(str: string): string {
  let masked = str;
  for (const { pattern, replacement } of PII_PATTERNS) {
    masked = masked.replace(pattern, replacement);
  }
  return masked;
}

function isPlainObject(value: any): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

export function maskData(data: any, seen: WeakSet<any> = new WeakSet()): any {
  if (typeof data === 'string') {
    return maskString(data);
  }

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (seen.has(data)) {
    return '[Circular]';
  }
  seen.add(data);

  if (data instanceof Error) {
    const maskedError = new Error(maskString(data.message));
    maskedError.name = data.name;
    if (data.stack) {
      maskedError.stack = maskString(data.stack);
    }

    // Explicitly preserve custom properties
    for (const key of Object.getOwnPropertyNames(data)) {
      if (key !== 'name' && key !== 'message' && key !== 'stack') {
        (maskedError as any)[key] = maskData((data as any)[key], seen);
      }
    }
    return maskedError;
  }

  if (Array.isArray(data)) {
    return data.map(item => maskData(item, seen));
  }

  // Bypass non-plain objects (e.g. Date, Set, Map)
  if (!isPlainObject(data)) {
    return data;
  }

  const maskedObj: Record<string, any> = {};
  for (const key of Object.keys(data)) {
    maskedObj[key] = maskData(data[key], seen);
  }

  return maskedObj;
}

export const logger = {
  log: (...args: any[]) => console.log(...args.map(arg => maskData(arg, new WeakSet()))),
  info: (...args: any[]) => console.info(...args.map(arg => maskData(arg, new WeakSet()))),
  warn: (...args: any[]) => console.warn(...args.map(arg => maskData(arg, new WeakSet()))),
  error: (...args: any[]) => console.error(...args.map(arg => maskData(arg, new WeakSet())))
};
