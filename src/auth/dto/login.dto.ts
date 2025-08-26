// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; // Ubah dari usernameOrEmail ke email untuk konsistensi

  @IsString()
  @IsNotEmpty()
  password: string;
}