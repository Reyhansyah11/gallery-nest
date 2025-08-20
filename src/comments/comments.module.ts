// src/comments/comments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Gallery } from '../entities/gallery.entity';
import { Album } from '../entities/album.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Gallery, Album])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}