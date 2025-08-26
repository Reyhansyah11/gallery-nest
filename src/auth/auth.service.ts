// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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
    this.logger.debug(`Password hashed for registration: ${email}`);

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
    const { email, password } = loginDto;

    this.logger.debug(`Login attempt for: ${email}`);

    // Find user by email (atau username jika Anda ingin tetap support keduanya)
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    this.logger.debug(`User found - ID: ${user.id}, Role: ${user.role}, Status: ${user.status}`);

    if (user.status !== 'active') {
      this.logger.warn(`User not active: ${email}`);
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // Check password
    this.logger.debug(`Comparing password for user: ${user.username}`);
    this.logger.debug(`Stored hash starts with: ${user.password.substring(0, 10)}...`);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    this.logger.debug(`Password validation result: ${isPasswordValid}`);
    
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    this.logger.debug(`Login successful for user: ${user.username} with role: ${user.role}`);

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