import { Client } from 'minio';
import { createLogger } from './logger';
import { config } from './config';

const logger = createLogger('MinIO');

const minioUrl = new URL(config.storage.endpoint);

export const minio = new Client({
  endPoint: minioUrl.hostname,
  port: minioUrl.port ? parseInt(minioUrl.port) : minioUrl.protocol === 'https:' ? 443 : 80,
  useSSL: minioUrl.protocol === 'https:',
  accessKey: config.storage.accessKey,
  secretKey: config.storage.secretKey,
});

// Initialize bucket
(async () => {
  try {
    const bucketExists = await minio.bucketExists(config.storage.bucket);
    if (!bucketExists) {
      await minio.makeBucket(config.storage.bucket, config.storage.region);
      logger.info(`Created bucket: ${config.storage.bucket}`);
    } else {
      logger.info(`Bucket already exists: ${config.storage.bucket}`);
    }
  } catch (err) {
    logger.error({ err }, 'Failed to initialize MinIO bucket');
  }
})();

export default minio;
