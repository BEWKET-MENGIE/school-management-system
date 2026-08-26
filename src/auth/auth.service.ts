import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service'; // Adjust this path if your PrismaService is located elsewhere

// If you prefer to keep your DTOs in this file for now, we add the "!" here.
// (Though it is best practice to move these to a separate login.dto.ts file later!)
export class LoginDto {
  email!: string;
  password!: string;
}

export class RegisterDto {
  email!: string;
  password!: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Compare the plain text password with the hashed password in the DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Generate the JWT payload and return the token
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // FIX: Renamed the new variable to 'hashedPassword' to prevent the ts(2451) redeclaration error
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN', // Adjust default role as needed based on your schema
      },
    });

    // Remove the password before returning the user object
    const sanitizedUser = Object.fromEntries(
      Object.entries(newUser).filter(([key]) => key !== 'password'),
    );
    return sanitizedUser;
  }
}
