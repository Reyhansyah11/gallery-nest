// src/users/users.controller.ts
import { Controller, Post, Get, Put, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UsersService, UpdateProfileDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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