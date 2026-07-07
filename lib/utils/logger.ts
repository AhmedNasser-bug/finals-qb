type RedactReplacement = string | ((match: string, ...args: any[]) => string);

const PII_PATTERNS: Array<{ pattern: RegExp; replacement: RedactReplacement }> = [
  {
    // Emails
    pattern: /([a-zA-Z0-9._%+-]{1,255}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,255})/g,
    replacement: '[REDACTED]'
  },
  {
    // Bearer tokens
    pattern: /(Bearer\s{1,255})([A-Za-z0-9\-\._~\+\/]{1,4096}={0,2})/g,
    replacement: '$1[REDACTED]'
  },
  {
    // Private keys
    pattern: /(-----BEGIN[A-Z0-9-\s]{1,255}PRIVATE KEY-----)([\s\S]{1,8192}?)(-----END[A-Z0-9-\s]{1,255}PRIVATE KEY-----)/g,
    replacement: '$1\n[REDACTED]\n$3'
  },
  {
    // Common secrets and PII
    pattern: /((?:api_key|apikey|secret|token|password|email|phone|ssn|credit_card)["']?\s{0,255}[:=]\s{0,255})(?:(")([^"]{0,4096})(")|(')([^']{0,4096})(')|([^,\]\}\s]{1,4096}))/gi,
    replacement: (match: string, p1: string, p2: string, p3: string, p4: string, p5: string, p6: string, p7: string, p8: string) => {
      if (p8 && (p8.startsWith('[') || p8.startsWith('{'))) {
        return match;
      }
      if (p2) return p1 + p2 + "[REDACTED]" + p4;
      if (p5) return p1 + p5 + "[REDACTED]" + p7;
      return p1 + '"[REDACTED]"';
    }
  },
  {
    // JWTs
    pattern: /(eyJ[A-Za-z0-9_-]{10,4096}\.[A-Za-z0-9_-]{1,4096}\.[A-Za-z0-9_-]{1,4096})/g,
    replacement: '[REDACTED]'
  }
];

function maskString(str: string): string {
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed === 'object' && parsed !== null) {
      return JSON.stringify(maskData(parsed, new WeakSet()));
    }
  } catch (e) {
    // Ignore and fallback to regex
  }

  let masked = str;
  for (const { pattern, replacement } of PII_PATTERNS) {
    masked = masked.replace(pattern, replacement as any);
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
    const length = data.length;
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = maskData(data[i], seen);
    }
    return result;
  }

  // Bypass non-plain objects (e.g. Date, Set, Map)
  if (!isPlainObject(data)) {
    return data;
  }

  const maskedObj: Record<string, any> = {};
  const sensitiveKeys = /api_key|apikey|secret|token|password|email|phone|ssn|credit_card/i;
  for (const key of Object.keys(data)) {
    if (sensitiveKeys.test(key) && (typeof data[key] === 'string' || typeof data[key] === 'number' || typeof data[key] === 'boolean')) {
      maskedObj[key] = '[REDACTED]';
    } else {
      maskedObj[key] = maskData(data[key], seen);
    }
  }

  return maskedObj;
}

export const logger = {
  log: (...args: any[]) => {
    const length = args.length;
    const maskedArgs = new Array(length);
    for (let i = 0; i < length; i++) {
      maskedArgs[i] = maskData(args[i], new WeakSet());
    }
    console.log(...maskedArgs);
  },
  info: (...args: any[]) => {
    const length = args.length;
    const maskedArgs = new Array(length);
    for (let i = 0; i < length; i++) {
      maskedArgs[i] = maskData(args[i], new WeakSet());
    }
    console.info(...maskedArgs);
  },
  warn: (...args: any[]) => {
    const length = args.length;
    const maskedArgs = new Array(length);
    for (let i = 0; i < length; i++) {
      maskedArgs[i] = maskData(args[i], new WeakSet());
    }
    console.warn(...maskedArgs);
  },
  error: (...args: any[]) => {
    const length = args.length;
    const maskedArgs = new Array(length);
    for (let i = 0; i < length; i++) {
      maskedArgs[i] = maskData(args[i], new WeakSet());
    }
    console.error(...maskedArgs);
  }
};
