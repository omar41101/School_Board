import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { level, className, status, page = 1, limit = 10 } = query;
    const where: any = {};
    
    if (level) where.level = level;
    if (className) where.className = className;
    if (status) where.status = status;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
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
          parent: true,
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      status: 'success',
      results: students.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: { students },
    };
  }

  async findByUserId(userId: number) {
    const student = await this.prisma.student.findFirst({
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
        parent: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      status: 'success',
      data: { student },
    };
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
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
        parent: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      status: 'success',
      data: { student },
    };
  }

  async create(createStudentDto: CreateStudentDto) {
    const student = await this.prisma.student.create({
      data: createStudentDto as any,
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
      data: { student },
    };
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const { firstName, lastName, email, phone, avatar, ...studentData } = updateStudentDto;

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Update user information if provided
    if (firstName || lastName || email || phone || avatar) {
      await this.prisma.user.update({
        where: { id: student.userId },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(avatar && { avatar }),
        },
      });
    }

    // Update student-specific information
    const updatedStudent = await this.prisma.student.update({
      where: { id },
      data: studentData as any,
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
      data: { student: updatedStudent },
    };
  }

  async remove(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.prisma.student.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Student deleted successfully',
    };
  }
}
