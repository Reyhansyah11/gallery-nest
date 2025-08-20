// src/likes/likes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { Gallery } from '../entities/gallery.entity';
import { Album } from '../entities/album.entity';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Gallery, Album])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}