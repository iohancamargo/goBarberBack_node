import fs from 'fs';
import mime from 'mime';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppErrors';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: process.env.AWS_DEFAULT_REGION,
        });
    }

    public async saveFile(file: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);
        const ContentType = mime.getType(originalPath);

        if (!ContentType) {
            throw new AppError('File doest exist');
        }

        const fileContent = await fs.promises.readFile(originalPath);

        await this.client
            .putObject({
                Bucket:
                    process.env.AWS_BUCKET_NAME !== undefined
                        ? process.env.AWS_BUCKET_NAME
                        : '',
                Key: file,
                ACL: 'public-read',
                Body: fileContent,
                ContentType,
            })
            .promise();

        await fs.promises.unlink(originalPath);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket:
                    process.env.AWS_BUCKET_NAME !== undefined
                        ? process.env.AWS_BUCKET_NAME
                        : '',
                Key: file,
            })
            .promise();
    }
}

export default S3StorageProvider;
