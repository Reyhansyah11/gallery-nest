// src/likes/likes.controller.ts
import { Controller, Post, Delete, Param, UseGuards, Request, ParseIntPipe, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('gallery/:id')
  async likeGallery(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.likesService.likeGallery(req.user.id, id);
    return {
      success: true,
      message: 'Gallery berhasil di-like',
    };
  }

  @Delete('gallery/:id')
  async unlikeGallery(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.likesService.unlikeGallery(req.user.id, id);
    return {
      success: true,
      message: 'Gallery berhasil di-unlike',
    };
  }

  @Post('album/:id')
  async likeAlbum(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.likesService.likeAlbum(req.user.id, id);
    return {
      success: true,
      message: 'Album berhasil di-like',
    };
  }

  @Delete('album/:id')
  async unlikeAlbum(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.likesService.unlikeAlbum(req.user.id, id);
    return {
      success: true,
      message: 'Album berhasil di-unlike',
    };
  }

  @Get('my')
  async getUserLikes(@Request() req) {
    const likes = await this.likesService.getUserLikes(req.user.id);
    return {
      success: true,
      data: likes,
    };
  }
}