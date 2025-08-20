// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, username, password, fullName } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('Email atau username sudah digunakan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      fullName,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    // Remove password from response using destructuring
    const { password: _, ...userWithoutPassword } = savedUser;

    return { user: userWithoutPassword, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { usernameOrEmail, password } = loginDto;

    // Find user by email or username
    const user = await this.userRepository.findOne({
      where: [
        { email: usernameOrEmail },
        { username: usernameOrEmail },
      ],
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response using destructuring
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User tidak valid');
    }

    return user;
  }
}