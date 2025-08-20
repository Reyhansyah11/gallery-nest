// src/albums/albums.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('albums')
@UseGuards(JwtAuthGuard)
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  async create(@Request() req, @Body() createAlbumDto: CreateAlbumDto) {
    const album = await this.albumsService.create(req.user.id, createAlbumDto);
    return {
      success: true,
      message: 'Album berhasil dibuat',
      data: album,
    };
  }

  @Get()
  async findAll(@Request() req, @Query('userId', ParseIntPipe) userId?: number) {
    const albums = await this.albumsService.findAll(req.user.id, userId);
    return {
      success: true,
      data: albums,
    };
  }

  @Get('my')
  async getUserAlbums(@Request() req) {
    const albums = await this.albumsService.getUserAlbums(req.user.id);
    return {
      success: true,
      data: albums,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const album = await this.albumsService.findOne(id, req.user.id);
    return {
      success: true,
      data: album,
    };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() updateAlbumDto: UpdateAlbumDto) {
    const album = await this.albumsService.update(id, req.user.id, updateAlbumDto);
    return {
      success: true,
      message: 'Album berhasil diupdate',
      data: album,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.albumsService.remove(id, req.user.id);
    return {
      success: true,
      message: 'Album berhasil dihapus',
    };
  }
}