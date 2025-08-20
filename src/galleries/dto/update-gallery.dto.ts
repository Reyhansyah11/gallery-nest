// src/galleries/dto/update-gallery.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateGalleryDto } from './create-gallery.dto';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {}