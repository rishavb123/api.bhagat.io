import crypto from 'crypto';

export function hashString(s) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(s);
    return md5sum.digest('hex');
}