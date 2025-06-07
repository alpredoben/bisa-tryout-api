process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { Client } from 'minio';
import { Environments as Cfg } from '../environments';

export const minioClient = new Client({
  endPoint: Cfg.MinioHost,
  port: parseInt(Cfg.MinioPort),
  useSSL: false,
  accessKey: Cfg.MinioUser,
  secretKey: Cfg.MinioPass,
});

/**
 * Ensure the bucket exists, or create it if necessary
 * @param bucketName Name of the bucket
 */
export const minioEnsureBucket = async (bucketName: string): Promise<void> => {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'us-east-1'); // You can change the region
    console.log(`Bucket '${bucketName}' created successfully`);
  }
};

/**
 * Upload a file to MinIO
 * @param bucketName Name of the bucket
 * @param objectName Name of the object in the bucket
 * @param filePath Path to the file
 */
export const minioUploadToStorage = async (
  bucketName: string,
  fileName: string,
  buffer: Buffer,
  fileSize: number,
  option: { [key: string]: string },
): Promise<void> => {
  try {
    if (!buffer || !fileName || !fileSize) {
      throw new Error('Invalid file data. Upload canceled.');
    }

    await minioClient.putObject(bucketName, fileName, buffer, fileSize, option);
    console.log(`✅ File '${fileName}' uploaded successfully to bucket '${bucketName}'`);
  } catch (error: any) {
    console.error(`❌ Failed to upload file '${fileName}' to bucket '${bucketName}':`, error.message);
    throw new Error(`Minio upload failed: ${error.message}`);
  }
};

/**
 * Download a file from MinIO
 * @param bucketName Name of the bucket
 * @param objectName Name of the object in the bucket
 * @param downloadPath Path where the file will be saved
 */
export const minioDownloadFile = async (
  bucketName: string,
  objectName: string,
  downloadPath: string,
): Promise<void> => {
  await minioClient.fGetObject(bucketName, objectName, downloadPath);
  console.log(`File '${objectName}' downloaded successfully from bucket '${bucketName}'`);
};
