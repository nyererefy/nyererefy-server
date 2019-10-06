import crypto from 'crypto'

/**
 * Used to encrypt and decrypt column string in database.
 */
export class ColumnEncryptionTransformer {
    private readonly key: Buffer;
    private readonly iv: Buffer;
    private readonly algorithm: string;

    constructor(private secret: string) {
        this.key = Buffer.from(this.secret, 'utf8');
        this.iv = Buffer.alloc(16, 0);
        this.algorithm = 'aes-128-cbc';
    }

    to(data: string): string {
        let cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');

        encrypted += cipher.final('hex');

        return encrypted;
    }

    from(data: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}