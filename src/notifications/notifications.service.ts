// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    fromUserId?: number,
    data?: any,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      message,
      fromUserId,
      data,
    });

    return await this.notificationRepository.save(notification);
  }

  async findUserNotifications(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      relations: ['fromUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await this.notificationRepository.update(
      { id, userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async sendToAllUsers(
    type: NotificationType,
    title: string,
    message: string,
  ): Promise<void> {
    // This would need to be implemented with a queue system for large user bases
    // For now, we'll create a simple implementation
    const users = await this.notificationRepository.query(
      'SELECT id FROM users WHERE status = "active"',
    );

    const notifications = users.map(user => ({
      userId: user.id,
      type,
      title,
      message,
      createdAt: new Date(),
    }));

    await this.notificationRepository.insert(notifications);
  }
}