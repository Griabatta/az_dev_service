import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc'; // Алгоритм шифрования
const key = crypto.randomBytes(32); // Ключ шифрования (32 байта для aes-256)
const iv = crypto.randomBytes(16);  // Вектор инициализации (16 байт)

// Функция для шифрования
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Функция для дешифрования
export function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}