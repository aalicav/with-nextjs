import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const SALT = 'FixedSalt123'; // Salt fixo

function getDerivedKey(salt: string): CryptoJS.lib.WordArray {
  return CryptoJS.PBKDF2(ENCRYPTION_KEY, salt, {
    keySize: 256 / 32,
    iterations: 1000
  });
}

export function encrypt(text: string): string {
  const key = getDerivedKey(SALT);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.ECB, // Modo ECB para consistência
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

export function decrypt(ciphertext: string): string {
  if(!ciphertext) {
    return '';
  }
  const key = getDerivedKey(SALT);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}