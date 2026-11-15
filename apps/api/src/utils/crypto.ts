import crypto from 'crypto';
import { config } from '../config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Derives a consistent 32-byte key from the configured token encryption secret
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.TOKEN_ENCRYPTION_SECRET || 'veltrix_hub_32_byte_aes_secret_key_prod!';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts sensitive tokens (OAuth tokens, refresh tokens) before saving to MongoDB
 */
export function encryptToken(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  // Format: iv:tag:encryptedData
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts encrypted tokens from MongoDB for secure API requests
 */
export function decryptToken(cipherText: string): string {
  if (!cipherText) return '';
  // If already a plain token (not encrypted with iv:tag format)
  if (!cipherText.includes(':')) {
    return cipherText;
  }

  const parts = cipherText.split(':');
  if (parts.length !== 3) return cipherText;

  const iv = Buffer.from(parts[0], 'hex');
  const key = getEncryptionKey();

  // Try format 1: iv:tag:encryptedText (where tag is 32 hex chars)
  // Try format 2: iv:encryptedText:tag (where tag is 32 hex chars at the end)
  const candidateFormats = [
    { tag: parts[1], text: parts[2] },
    { tag: parts[2], text: parts[1] }
  ];

  for (const { tag, text } of candidateFormats) {
    if (tag.length !== 32) continue;
    try {
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      let decrypted = decipher.update(text, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      if (decrypted) return decrypted;
    } catch {
      // try next candidate format
    }
  }

  console.warn('[Crypto Warning] Could not decrypt token with known formats');
  return '';
}
