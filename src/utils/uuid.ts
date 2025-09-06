// UUID utility for Vercel Edge Runtime
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
 * Check if a string is a valid UUID v4
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a short UUID (first 8 characters)
 * Useful for shorter identifiers
 */
export function generateShortUUID(): string {
  return crypto.randomUUID().substring(0, 8);
}
