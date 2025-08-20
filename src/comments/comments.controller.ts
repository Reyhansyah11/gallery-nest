// src/comments/comments.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CommentsService, CreateCommentDto } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentsService.create(req.user.id, createCommentDto);
    return {
      success: true,
      message: 'Komentar berhasil ditambahkan',
      data: comment,
    };
  }

  @Get('gallery/:id')
  async findGalleryComments(@Param('id', ParseIntPipe) id: number) {
    const comments = await this.commentsService.findGalleryComments(id);
    return {
      success: true,
      data: comments,
    };
  }

  @Get('album/:id')
  async findAlbumComments(@Param('id', ParseIntPipe) id: number) {
    const comments = await this.commentsService.findAlbumComments(id);
    return {
      success: true,
      data: comments,
    };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body('content') content: string) {
    const comment = await this.commentsService.update(id, req.user.id, content);
    return {
      success: true,
      message: 'Komentar berhasil diupdate',
      data: comment,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.commentsService.remove(id, req.user.id);
    return {
      success: true,
      message: 'Komentar berhasil dihapus',
    };
  }
}