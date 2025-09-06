// Example usage of UUID utilities for Vercel Edge Runtime

// ✅ For client-side code (React components)
// import { uuidv4, generateUUID, generateShortUUID, isValidUUID } from './src/utils/uuid';

// ✅ For API routes (Edge Runtime)  
// import { uuidv4, generateRequestId, generateSessionId } from './api/utils/uuid';

// Examples:

// 1. Generate a standard UUID
// const id = uuidv4(); // or generateUUID()
// Output: "f47ac10b-58cc-4372-a567-0e02b2c3d479"

// 2. Generate a short ID
// const shortId = generateShortUUID();
// Output: "f47ac10b"

// 3. Validate a UUID
// const isValid = isValidUUID("f47ac10b-58cc-4372-a567-0e02b2c3d479"); // true

// 4. For API tracing
// const requestId = generateRequestId();
// Output: "req_f47ac10b58cc4372"

// 5. For sessions
// const sessionId = generateSessionId();
// Output: "sess_f47ac10b58cc4372a567"

export {};
