import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const payload = { email: user.email, id: user.id };
    return {
      success: true,
      token: this.jwtService.sign(payload),
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, email, password, role, ...additionalData } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'student',
      },
    });

    // Create role-specific profile
    let profileCreated = false;

    try {
      if (role === 'student' && additionalData.matricule && additionalData.dateOfBirth) {
        await this.prisma.student.create({
          data: {
            userId: user.id,
            matricule: additionalData.matricule,
            dateOfBirth: new Date(additionalData.dateOfBirth),
            gender: additionalData.gender as 'male' | 'female',
            level: additionalData.level,
            className: additionalData.className,
            section: additionalData.section,
            addressStreet: additionalData.address?.street,
            addressCity: additionalData.address?.city,
            addressState: additionalData.address?.state,
            addressZipCode: additionalData.address?.zipCode,
            addressCountry: additionalData.address?.country,
            parentId: additionalData.parentId,
            bloodGroup: additionalData.medicalInfo?.bloodGroup,
            allergies: additionalData.medicalInfo?.allergies || [],
            medicalConditions: additionalData.medicalInfo?.medicalConditions || [],
            emergencyContactName: additionalData.medicalInfo?.emergencyContact?.name,
            emergencyContactRelationship: additionalData.medicalInfo?.emergencyContact?.relationship,
            emergencyContactPhone: additionalData.medicalInfo?.emergencyContact?.phone,
            previousSchoolName: additionalData.previousSchool?.name,
            previousSchoolYear: additionalData.previousSchool?.year,
            documents: additionalData.documents || [],
          },
        });
        profileCreated = true;
      } else if (role === 'teacher' && additionalData.employeeId && additionalData.dateOfBirth) {
        await this.prisma.teacher.create({
          data: {
            userId: user.id,
            employeeId: additionalData.employeeId,
            dateOfBirth: new Date(additionalData.dateOfBirth),
            gender: additionalData.gender as 'male' | 'female',
            qualification: additionalData.qualification,
            specialization: additionalData.specialization,
            salary: additionalData.salary,
            subjects: additionalData.subjects || [],
            experience: additionalData.experience || 0,
            addressStreet: additionalData.address?.street,
            addressCity: additionalData.address?.city,
            addressState: additionalData.address?.state,
            addressZipCode: additionalData.address?.zipCode,
            addressCountry: additionalData.address?.country,
            classes: additionalData.classes || [],
            schedule: additionalData.schedule || [],
            documents: additionalData.documents || [],
          },
        });
        profileCreated = true;
      } else if (role === 'parent' && additionalData.relationship) {
        await this.prisma.parent.create({
          data: {
            userId: user.id,
            relationship: additionalData.relationship as 'father' | 'mother' | 'guardian',
            occupation: additionalData.occupation,
            addressStreet: additionalData.address?.street,
            addressCity: additionalData.address?.city,
            addressState: additionalData.address?.state,
            addressZipCode: additionalData.address?.zipCode,
            addressCountry: additionalData.address?.country,
            emergencyContactName: additionalData.emergencyContact?.name,
            emergencyContactRelationship: additionalData.emergencyContact?.relationship,
            emergencyContactPhone: additionalData.emergencyContact?.phone,
          },
        });
        profileCreated = true;
      }
    } catch (error) {
      console.log('Profile creation skipped or failed:', error.message);
    }

    const payload = { email: user.email, id: user.id };
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      token: this.jwtService.sign(payload),
      data: {
        ...userWithoutPassword,
        profileCreated,
      },
    };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: user,
    };
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    const payload = { email: user.email, id: user.id };

    return {
      status: 'success',
      token: this.jwtService.sign(payload),
      message: 'Password updated successfully',
    };
  }
}
