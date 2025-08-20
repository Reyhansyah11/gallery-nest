// src/collections/collections.controller.ts
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CollectionsService, CreateCollectionDto } from './collections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async create(@Request() req, @Body() createCollectionDto: CreateCollectionDto) {
    const collection = await this.collectionsService.create(req.user.id, createCollectionDto);
    return {
      success: true,
      message: 'Gallery berhasil ditambahkan ke koleksi',
      data: collection,
    };
  }

  @Get()
  async findUserCollections(@Request() req) {
    const collections = await this.collectionsService.findUserCollections(req.user.id);
    return {
      success: true,
      data: collections,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.collectionsService.remove(id, req.user.id);
    return {
      success: true,
      message: 'Gallery berhasil dihapus dari koleksi',
    };
  }

  @Delete('gallery/:galleryId')
  async removeByGallery(@Param('galleryId', ParseIntPipe) galleryId: number, @Request() req) {
    await this.collectionsService.removeByGallery(req.user.id, galleryId);
    return {
      success: true,
      message: 'Gallery berhasil dihapus dari koleksi',
    };
  }
}