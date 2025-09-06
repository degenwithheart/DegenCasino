import { verify } from '@noble/ed25519'
import bs58 from 'bs58'

/**
 * Verifies a Solana Ed25519 signature.
 * @param message - The exact message bytes the user signed.
 * @param signature - The signature as a base58 string.
 * @param publicKey - The public key as a base58 string.
 * @returns Promise<boolean> - True if the signature is valid.
 */
export async function verifySolanaSignature(
  message: Uint8Array,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const sigBytes = bs58.decode(signature)
    const pubKeyBytes = bs58.decode(publicKey)
    
    return await verify(sigBytes, message, pubKeyBytes)
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

/**
 * Usage pattern for admin actions:
 * 
 * 1. Require message format like "ACTION:nonce" (nonce from server, one-time).
 * 2. Verify with verifySolanaSignature.
 * 3. Store and invalidate nonce (KV or short-term cache) to prevent replay.
 * 4. Rate limit by IP and wallet.
 */
