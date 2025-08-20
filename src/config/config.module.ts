import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Album } from '../entities/album.entity';
import { Gallery } from '../entities/gallery.entity';
import { Collection } from '../entities/collection.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';
import { Follow } from '../entities/follow.entity';
import { Report } from '../entities/report.entity';
import { Notification } from '../entities/notification.entity';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'gallery_app',
      entities: [User, Album, Gallery, Collection, Like, Comment, Follow, Report, Notification],
      synchronize: true, // Set false di production
    }),
  ],
})
export class ConfigurationModule {}