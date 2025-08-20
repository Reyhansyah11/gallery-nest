// src/comments/comments.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, CommentType, CommentStatus } from '../entities/comment.entity'; // Import CommentStatus
import { Gallery } from '../entities/gallery.entity';
import { Album } from '../entities/album.entity';

export class CreateCommentDto {
  content: string;
  type: CommentType;
  galleryId?: number;
  albumId?: number;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async create(userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const { type, galleryId, albumId } = createCommentDto;

    // Validate target exists
    if (type === CommentType.GALLERY && galleryId) {
      const gallery = await this.galleryRepository.findOne({
        where: { id: galleryId },
      });
      if (!gallery) {
        throw new NotFoundException('Gallery tidak ditemukan');
      }
    } else if (type === CommentType.ALBUM && albumId) {
      const album = await this.albumRepository.findOne({
        where: { id: albumId },
      });
      if (!album) {
        throw new NotFoundException('Album tidak ditemukan');
      }
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
    });

    return await this.commentRepository.save(comment);
  }

  async findGalleryComments(galleryId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { galleryId, type: CommentType.GALLERY, status: CommentStatus.ACTIVE }, // Gunakan enum
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAlbumComments(albumId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { albumId, type: CommentType.ALBUM, status: CommentStatus.ACTIVE }, // Gunakan enum
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, userId: number, content: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id, userId },
    });

    if (!comment) {
      throw new NotFoundException('Komentar tidak ditemukan atau tidak memiliki akses');
    }

    comment.content = content;
    return await this.commentRepository.save(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id, userId },
    });

    if (!comment) {
      throw new NotFoundException('Komentar tidak ditemukan atau tidak memiliki akses');
    }

    await this.commentRepository.remove(comment);
  }
}