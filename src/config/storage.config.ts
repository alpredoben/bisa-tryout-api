import crypto from 'crypto';
import { Request, Response } from 'express';
import mime from 'mime-types';
import multer from 'multer';
import { Environments as Cfg } from '../environments';
import { I_ExpressResponse, I_MulterInterface } from '../interfaces/app.interface';
import { MessageDialog } from '../lang';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.util';
import { minioClient, minioEnsureBucket, minioUploadToStorage } from './minio.config';

const BUCKET_NAME = Cfg.MinioBucketName;
const BASE_URL = Cfg?.DomainApi ? Cfg?.DomainApi : `http://${Cfg.AppHost}:${Cfg.AppPort}`;

// Generate unique filename
export const generateFileName = (originalName: string): string => {
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop();
  return `${randomString}-${Date.now()}.${extension}`;
};

export const getFileAndExtension = (originalName: string): { [key: string]: any } => {
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop();
  return {
    filename: `${randomString}-${Date.now()}.${extension}`,
    extension,
  };
};

const multerStorage = multer.memoryStorage();

// Upload Middleware
export const uploadImageToStorage = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Upload File To Minio
export const uploadFile = async (req: Request): Promise<I_ExpressResponse> => {
  try {
    await minioEnsureBucket(BUCKET_NAME);

    if (!req?.file) {
      return {
        success: false,
        code: 400,
        message: MessageDialog.__('error.default.noFileUpload'),
        data: null,
      };
    }

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/tiff',
      'image/svg+xml',
      'image/webp',
      'image/bmp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls, .csv (older Excel formats)
      'text/csv',
    ];
    const maxFileSize = 10 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(req.file.mimetype)) {
      return {
        success: false,
        code: 400,
        message: MessageDialog.__('error.default.invalidFileType'),
        data: null,
      };
    }

    if (req.file.size > maxFileSize) {
      return {
        success: false,
        code: 400,
        message: MessageDialog.__('error.default.fileTooLarge'),
        data: null,
      };
    }

    const row = getFileAndExtension(req?.file?.originalname ?? 'unknown');

    await minioUploadToStorage(BUCKET_NAME, row.filename, req?.file?.buffer, req?.file?.size, {
      'Content-Type': req?.file?.mimetype,
    });

    const fileUrl = `${BASE_URL}/api/v1/files/${row.filename}`;

    return {
      success: true,
      message: MessageDialog.__('success.default.uploadFileToStorage'),
      code: 200,
      data: {
        file_name: `${row.filename}`,
        file_url: fileUrl,
      },
    };
  } catch (error: any) {
    console.log({ ERROR_FILE: error });
    return {
      success: false,
      message: error.message,
      code: 400,
      data: error,
    };
  }
};

// Get File URL
export const getFileUrl = (fileName: string): string => {
  return `${BASE_URL}/api/v1/files/${fileName}`;
};

// Fetch file from Minio
export const fetchFileFromStorage = async (req: Request, res: Response): Promise<void> => {
  try {
    let { filename } = req.params;

    console.log({ filename });
    // Tambahkan ekstensi jika tidak ada titik
    if (!filename.includes('.')) {
      filename += '.svg';
    }

    const fileStream = await minioClient.getObject(BUCKET_NAME, filename);
    const contentType = mime.lookup(filename) || 'application/octet-stream';

    console.log({ fileStream });

    console.log('Serving:', filename, '| Content-Type:', contentType);

    res.setHeader('Content-Type', contentType);

    // Jangan set Content-Disposition untuk image
    if (!contentType.startsWith('image/')) {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }

    fileStream.on('data', (chunk) => {
      console.log('Streaming chunk:', chunk.length);
    });

    fileStream.pipe(res);
  } catch (error: any) {
    console.error('Error:', error?.message || error);
    sendErrorResponse(res, 404, MessageDialog.__('error.default.notFoundItem', { value: 'File' }));
  }
};

// Delete File From Minio
export const removeFileInStorage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filename } = req.params;
    await minioClient.removeObject(BUCKET_NAME, filename);
    return sendSuccessResponse(res, 200, MessageDialog.__('success.default.deleteFileFromStorage'), {
      valeu: filename,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 'Error deleting file', error);
  }
};

// Multer wrapper for Express route handlers
export const multerUpload = (options: I_MulterInterface) => {
  return options?.type === 'single' ? uploadImageToStorage.single(options.name) : uploadImageToStorage.any();
};
