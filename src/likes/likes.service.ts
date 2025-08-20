// src/likes/likes.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, LikeType } from '../entities/like.entity';
import { Gallery } from '../entities/gallery.entity';
import { Album } from '../entities/album.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async likeGallery(userId: number, galleryId: number): Promise<void> {
    const gallery = await this.galleryRepository.findOne({
      where: { id: galleryId },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery tidak ditemukan');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { userId, galleryId, type: LikeType.GALLERY },
    });

    if (existingLike) {
      throw new ConflictException('Sudah like gallery ini');
    }

    const like = this.likeRepository.create({
      userId,
      galleryId,
      type: LikeType.GALLERY,
    });

    await this.likeRepository.save(like);
  }

  async unlikeGallery(userId: number, galleryId: number): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { userId, galleryId, type: LikeType.GALLERY },
    });

    if (!like) {
      throw new NotFoundException('Belum like gallery ini');
    }

    await this.likeRepository.remove(like);
  }

  async likeAlbum(userId: number, albumId: number): Promise<void> {
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Album tidak ditemukan');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { userId, albumId, type: LikeType.ALBUM },
    });

    if (existingLike) {
      throw new ConflictException('Sudah like album ini');
    }

    const like = this.likeRepository.create({
      userId,
      albumId,
      type: LikeType.ALBUM,
    });

    await this.likeRepository.save(like);
  }

  async unlikeAlbum(userId: number, albumId: number): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { userId, albumId, type: LikeType.ALBUM },
    });

    if (!like) {
      throw new NotFoundException('Belum like album ini');
    }

    await this.likeRepository.remove(like);
  }

  async getUserLikes(userId: number): Promise<Like[]> {
    return await this.likeRepository.find({
      where: { userId },
      relations: ['gallery', 'album'],
      order: { createdAt: 'DESC' },
    });
  }
}