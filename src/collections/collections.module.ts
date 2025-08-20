// src/collections/collections.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../entities/collection.entity';
import { Gallery } from '../entities/gallery.entity';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Gallery])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}