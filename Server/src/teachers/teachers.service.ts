import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    return {
      status: 'success',
      results: teachers.length,
      data: { teachers },
    };
  }

  async findByUserId(userId: number) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            phone: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return {
      status: 'success',
      data: { teacher },
    };
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return {
      status: 'success',
      data: { teacher },
    };
  }

  async create(createTeacherDto: CreateTeacherDto) {
    const teacher = await this.prisma.teacher.create({
      data: createTeacherDto as any,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    return {
      status: 'success',
      data: { teacher },
    };
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const updatedTeacher = await this.prisma.teacher.update({
      where: { id },
      data: updateTeacherDto as any,
      include: {
        user: true,
      },
    });

    return {
      status: 'success',
      data: { teacher: updatedTeacher },
    };
  }

  async remove(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    await this.prisma.teacher.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Teacher deleted',
    };
  }
}
