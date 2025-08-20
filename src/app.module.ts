// src/app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigurationModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { GalleriesModule } from './galleries/galleries.module';
import { CollectionsModule } from './collections/collections.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigurationModule,
    AuthModule,
    UsersModule,
    AlbumsModule,
    GalleriesModule,
    CollectionsModule,
    LikesModule,
    CommentsModule,
    ReportsModule,
    NotificationsModule,
  ],
})
export class AppModule {}