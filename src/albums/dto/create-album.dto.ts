// src/albums/dto/create-album.dto.ts
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}