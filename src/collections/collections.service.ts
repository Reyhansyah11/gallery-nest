// src/collections/collections.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '../entities/collection.entity';
import { Gallery } from '../entities/gallery.entity';

export class CreateCollectionDto {
  name: string;
  description?: string;
  isPrivate?: boolean;
  galleryId: number;
}

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  async create(userId: number, createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const { galleryId } = createCollectionDto;

    // Check if gallery exists
    const gallery = await this.galleryRepository.findOne({
      where: { id: galleryId },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery tidak ditemukan');
    }

    // Check if already in collection
    const existingCollection = await this.collectionRepository.findOne({
      where: { userId, galleryId },
    });

    if (existingCollection) {
      throw new ConflictException('Gallery sudah ada di koleksi');
    }

    const collection = this.collectionRepository.create({
      ...createCollectionDto,
      userId,
    });

    return await this.collectionRepository.save(collection);
  }

  async findUserCollections(userId: number): Promise<Collection[]> {
    return await this.collectionRepository.find({
      where: { userId },
      relations: ['gallery', 'gallery.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const collection = await this.collectionRepository.findOne({
      where: { id, userId },
    });

    if (!collection) {
      throw new NotFoundException('Koleksi tidak ditemukan atau tidak memiliki akses');
    }

    await this.collectionRepository.remove(collection);
  }

  async removeByGallery(userId: number, galleryId: number): Promise<void> {
    const collection = await this.collectionRepository.findOne({
      where: { userId, galleryId },
    });

    if (collection) {
      await this.collectionRepository.remove(collection);
    }
  }
}