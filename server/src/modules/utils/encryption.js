import crypto from 'crypto';

export function hashString(s) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(s);
    return md5sum.digest('hex');
}

export function checkHash(s, hash) {
    return hashString(s) === hash;
}

export function generatePassword(passwordLength) {
    const str = (Math.random() + 1).toString(36);
    return str.substring(str.length - passwordLength);
}
