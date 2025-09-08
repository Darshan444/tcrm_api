// Configs/encrypt.js
import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

const key = process.env.ENCRYPTION_KEY || 'your-default-encryption-key';

export class EncryptionHandler {
    encrypt(data) {
        try {
            let encryptedData = {
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data
            };

            return CryptoJS.AES.encrypt(JSON.stringify(encryptedData), key).toString();
        } catch (error) {
            console.error('Encryption error:', error);
            return error;
        }
    }

    decrypt(data) {
        try {
            let bytes = CryptoJS.AES.decrypt(data, key);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedData) {
                throw new Error('Failed to decrypt data');
            }
            
            return decryptedData;
        } catch (error) {
            console.error('Decryption error:', error);
            return error;
        }
    }

    encryptEntity(entity) {
        try {
            return bcrypt.hashSync(
                entity.toString(), 
                bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10)
            );
        } catch (error) {
            console.error('Entity encryption error:', error);
            throw error;
        }
    }

    compareEncryptEntity(entity, encryptedEntity) {
        try {
            return bcrypt.compareSync(entity, encryptedEntity);
        } catch (error) {
            console.error('Entity comparison error:', error);
            return false;
        }
    }

    // Additional utility methods
    generateHash(data) {
        return CryptoJS.SHA256(data).toString();
    }

    generateRandomKey(length = 32) {
        return CryptoJS.lib.WordArray.random(length).toString();
    }
}