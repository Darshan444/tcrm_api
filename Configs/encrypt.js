const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
const key = process.env.ENCRYPTION_KEY;

export class EncryptionHandler {
    encrypt(data) {
        try {
            let encryptedData = {
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data
            };

            return CryptoJS.AES.encrypt(JSON.stringify(encryptedData), key).toString();
        } catch (error) {
            return error
        }
    }

    decrypt(data) {
        try {
            let bytes = CryptoJS.AES.decrypt(data, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            return error
        }
    }

    encryptEntity(entity) {
        return bcrypt.hashSync(entity.toString(), bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS)), null);
    }

    compareEncryptEntity(entity, encryptEntity) {
        return bcrypt.compareSync(entity, encryptEntity);
    }
}
