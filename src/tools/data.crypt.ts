import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.CRYPTO_KEY || 'default-secret', 'salt', 32);
const iv = Buffer.alloc(16, 0); // Для простоты, в production используйте random iv


  export async function encrypt(text: string): Promise<string> {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }


  export async function decrypt(encryptedText: string): Promise<string> {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }