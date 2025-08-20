// src/galleries/galleries.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, Query, UseInterceptors, UploadedFile, Res, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileUploadService } from '../common/services/file-upload.service';

@Controller('galleries')
@UseGuards(JwtAuthGuard)
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', FileUploadService.getMulterConfig()))
  async create(
    @Request() req,
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = FileUploadService.getImagePath(file.filename);
    const gallery = await this.galleriesService.create(req.user.id, createGalleryDto, imageUrl);
    
    return {
      success: true,
      message: 'Gallery berhasil dibuat',
      data: gallery,
    };
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('userId', ParseIntPipe) userId?: number
  ) {
    if (userId) {
      const galleries = await this.galleriesService.findUserGalleries(req.user.id, userId);
      return {
        success: true,
        data: galleries,
      };
    }

    const result = await this.galleriesService.findAll(req.user.id, +page, +limit);
    return {
      success: true,
      data: result.data,
      pagination: {
        page: +page,
        limit: +limit,
        total: result.total,
        totalPages: Math.ceil(result.total / +limit),
      },
    };
  }

  @Get('my')
  async getUserGalleries(@Request() req) {
    const galleries = await this.galleriesService.findUserGalleries(req.user.id);
    return {
      success: true,
      data: galleries,
    };
  }

  @Get('album/:albumId')
  async getAlbumGalleries(@Param('albumId', ParseIntPipe) albumId: number, @Request() req) {
    const galleries = await this.galleriesService.getAlbumGalleries(albumId, req.user.id);
    return {
      success: true,
      data: galleries,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const gallery = await this.galleriesService.findOne(id, req.user.id);
    return {
      success: true,
      data: gallery,
    };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() updateGalleryDto: UpdateGalleryDto) {
    const gallery = await this.galleriesService.update(id, req.user.id, updateGalleryDto);
    return {
      success: true,
      message: 'Gallery berhasil diupdate',
      data: gallery,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.galleriesService.remove(id, req.user.id);
    return {
      success: true,
      message: 'Gallery berhasil dihapus',
    };
  }

  @Post(':id/download')
  async downloadGallery(@Param('id', ParseIntPipe) id: number, @Request() req, @Res() res: Response) {
    const gallery = await this.galleriesService.findOne(id, req.user.id);
    await this.galleriesService.incrementDownloadCount(id);
    
    // Return file for download
    return res.download(gallery.imageUrl, `${gallery.title}.jpg`);
  }
}