// UUID utility for Vercel Edge Runtime API routes
// Uses Web Crypto API which is available in Edge Runtime

/**
 * Generate a v4 UUID using Web Crypto API
 * Compatible with Vercel Edge Runtime
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Generate a v4 UUID (alias for compatibility)
 * Use this as a drop-in replacement for uuidv4()
 */
export const uuidv4 = generateUUID;

/**
 * Generate a request ID for API tracing
 */
export function generateRequestId(): string {
  return `req_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
}

/**
 * Generate a session ID
 */
export function generateSessionId(): string {
  return `sess_${crypto.randomUUID().replace(/-/g, '').substring(0, 20)}`;
}
