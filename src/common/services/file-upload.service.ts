// src/common/services/file-upload.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadService {
  static getMulterConfig() {
    return {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: process.env.MAX_FILE_SIZE 
          ? parseInt(process.env.MAX_FILE_SIZE) 
          : 5 * 1024 * 1024, // Default 5MB
      },
    };
  }

  static getImagePath(filename: string): string {
    return `uploads/images/${filename}`;
  }
}