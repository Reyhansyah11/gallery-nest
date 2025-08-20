// src/notifications/notifications.controller.ts
import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { NotificationType } from '../entities/notification.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findUserNotifications(@Request() req) {
    const notifications = await this.notificationsService.findUserNotifications(req.user.id);
    return {
      success: true,
      data: notifications,
    };
  }

  @Put(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.notificationsService.markAsRead(id, req.user.id);
    return {
      success: true,
      message: 'Notifikasi berhasil ditandai sebagai dibaca',
    };
  }

  @Put('read-all')
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return {
      success: true,
      message: 'Semua notifikasi berhasil ditandai sebagai dibaca',
    };
  }

  // Admin only endpoints
  @UseGuards(AdminGuard)
  @Post('broadcast')
  async sendToAllUsers(
    @Body('type') type: NotificationType,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    await this.notificationsService.sendToAllUsers(type, title, message);
    return {
      success: true,
      message: 'Notifikasi berhasil dikirim ke semua user',
    };
  }
}