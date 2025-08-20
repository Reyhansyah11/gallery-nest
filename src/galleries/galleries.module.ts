// src/galleries/galleries.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from '../entities/gallery.entity';
import { Album } from '../entities/album.entity';
import { GalleriesService } from './galleries.service';
import { GalleriesController } from './galleries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, Album])],
  controllers: [GalleriesController],
  providers: [GalleriesService],
})
export class GalleriesModule {}