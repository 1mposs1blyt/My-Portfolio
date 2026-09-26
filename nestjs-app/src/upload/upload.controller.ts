import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { AdminGuard } from '../admin/admin.guard.js';
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
@Controller('upload')
export class UploadController {
  @Post('image')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase().slice(0, 5);
          cb(null, `${randomBytes(16).toString('hex')}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED.includes(file.mimetype)) {
          return cb(new BadRequestException('Только изображения'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 8 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Файл не получен');
    return {
      url: `/public/uploads/${file.filename}`,
    };
  }
}
