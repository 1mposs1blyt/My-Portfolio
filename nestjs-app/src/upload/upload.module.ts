// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller.js';

@Module({ controllers: [UploadController] })
export class UploadModule {}