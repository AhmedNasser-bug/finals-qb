export const logger = {
  error: (...args: any[]) => {
    console.error(...maskArgs(args))
  },
  warn: (...args: any[]) => {
    console.warn(...maskArgs(args))
  },
  info: (...args: any[]) => {
    console.info(...maskArgs(args))
  },
  log: (...args: any[]) => {
    console.log(...maskArgs(args))
  }
}

export function maskString(str: string): string {
  let result = str

  // Email
  result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]")

  // JWT
  result = result.replace(/eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}/g, "[REDACTED_JWT]")

  // Credit cards (basic pattern for 16 digits)
  result = result.replace(/\b(?:\d[ -]*?){13,16}\b/g, "[REDACTED_CC]")

  // API Keys / Secrets / Tokens / Passwords (catch key=value or JSON)
  result = result.replace(/(api_key|apikey|secret|token|password|auth_token)(["'\s:=]+)([a-zA-Z0-9\-_]+)/gi, "$1$2[REDACTED]")

  // Private keys
  result = result.replace(/-----BEGIN[A-Z\s]+PRIVATE KEY-----[A-Za-z0-9+/=\s]+-----END[A-Z\s]+PRIVATE KEY-----/g, "[REDACTED_PRIVATE_KEY]")

  return result
}

function traverseAndMask(obj: any, seen: WeakSet<any>): any {
  if (typeof obj === "string") {
    return maskString(obj)
  }
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  // Handle circular references
  if (seen.has(obj)) {
    return "[Circular]"
  }
  seen.add(obj)

  if (obj instanceof Error) {
    const maskedErr = new Error(maskString(obj.message))
    maskedErr.name = obj.name
    maskedErr.stack = obj.stack ? maskString(obj.stack) : undefined
    // Copy all other custom properties
    const props = Object.getOwnPropertyNames(obj)
    for (const key of props) {
      if (key !== "name" && key !== "message" && key !== "stack") {
        try {
          // @ts-ignore
          maskedErr[key] = traverseAndMask(obj[key], seen)
        } catch {
           // Ignore errors copying custom properties
        }
      }
    }
    return maskedErr
  }

  if (Array.isArray(obj)) {
    return obj.map(item => traverseAndMask(item, seen))
  }

  // Check for plain objects
  const isPlainObject = Object.prototype.toString.call(obj) === "[object Object]" &&
                        (Object.getPrototypeOf(obj) === null || Object.getPrototypeOf(obj) === Object.prototype)

  if (isPlainObject) {
    const newObj: any = {}
    for (const key of Object.keys(obj)) {
      try {
        newObj[key] = traverseAndMask(obj[key], seen)
      } catch {
        // Fallback
        newObj[key] = obj[key]
      }
    }
    return newObj
  }

  // For Dates, Sets, Maps, RegExp, Buffers, etc. return as is.
  // We avoid mutating them or cloning them incorrectly.
  return obj
}

export function maskArgs(args: any[]): any[] {
  return args.map((arg) => traverseAndMask(arg, new WeakSet()))
}
