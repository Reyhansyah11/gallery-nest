// src/users/users.controller.ts
import { Controller, Post, Get, Put, Body, Param, UseGuards, Request, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService, UpdateProfileDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Multer configuration for avatar uploads
const avatarStorage = diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
    callback(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getOwnProfile(@Request() req) {
    const user = await this.usersService.getProfile(req.user.id);
    return {
      success: true,
      data: user,
    };
  }

  @Get('profile/:id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = await this.usersService.getProfile(req.user.id, id);
    return {
      success: true,
      data: user,
    };
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, updateData);
    return {
      success: true,
      message: 'Profile berhasil diupdate',
      data: user,
    };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: avatarStorage,
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        success: false,
        message: 'No file uploaded',
      };
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    
    // Update user avatar in database
    await this.usersService.updateProfile(req.user.id, { avatar: avatarUrl });

    return {
      success: true,
      message: 'Avatar berhasil diupload',
      data: {
        avatarUrl,
        filename: file.filename,
      },
    };
  }

  @Post(':id/follow')
  async followUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.usersService.followUser(req.user.id, id);
    return {
      success: true,
      message: 'Berhasil follow user',
    };
  }

  @Post(':id/unfollow')
  async unfollowUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.usersService.unfollowUser(req.user.id, id);
    return {
      success: true,
      message: 'Berhasil unfollow user',
    };
  }

  @Get(':id/followers')
  async getFollowers(@Param('id', ParseIntPipe) id: number) {
    const followers = await this.usersService.getFollowers(id);
    return {
      success: true,
      data: followers,
    };
  }

  @Get(':id/following')
  async getFollowing(@Param('id', ParseIntPipe) id: number) {
    const following = await this.usersService.getFollowing(id);
    return {
      success: true,
      data: following,
    };
  }
}