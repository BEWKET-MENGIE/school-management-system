import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Student } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && user.isActive && (await bcrypt.compare(pass, user.password))) {
      const result = Object.assign({}, user);
      delete (result as Record<string, unknown>).password;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const {
      email,
      role,
      firstName,
      lastName,
      phone,
      gender,
      admissionNumber,
      currentGradeLevel,
    } = registerDto;

    const resultUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          isActive: true,
        },
      });

      if (role === 'STUDENT') {
        await tx.student.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            gender: gender || '',
            admissionNumber: admissionNumber || `ADM-${Date.now()}`,
            currentGradeLevel: currentGradeLevel || 9,
          },
        });
      }

      return user;
    });

    const result = Object.assign({}, resultUser);
    delete (result as Record<string, unknown>).password;

    const localCreatedAt = new Date(resultUser.createdAt).toLocaleString(
      'en-US',
      {
        timeZone: 'Africa/Addis_Ababa',
      },
    );
    const localUpdatedAt = new Date(resultUser.updatedAt).toLocaleString(
      'en-US',
      {
        timeZone: 'Africa/Addis_Ababa',
      },
    );

    return {
      message: 'User and profile registered successfully',
      id: result.id,
      email: result.email,
      role: result.role,
      isActive: result.isActive,
      profile: {
        firstName,
        lastName,
        gender: gender || '',
        currentGradeLevel: currentGradeLevel || null,
        admissionNumber: admissionNumber || null,
        phone: phone || null,
      },
      createdAt: localCreatedAt,
      updatedAt: localUpdatedAt,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new BadRequestException('Invalid credentials or inactive account.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      accessToken,
    };
  }

  async getProfile(userId: string, role: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userWithoutPassword = Object.assign({}, user);
    delete (userWithoutPassword as Record<string, unknown>).password;

    let profile: Student | null = null;
    if (role === 'STUDENT') {
      profile = await this.prisma.student.findUnique({
        where: { userId },
      });
    }

    return {
      ...userWithoutPassword,
      profile: profile || {},
    };
  }
}
