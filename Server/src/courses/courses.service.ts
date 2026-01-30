import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { level, subject, status } = query;
    const where: any = {};
    
    if (level) where.level = level;
    if (subject) where.subject = subject;
    if (status) where.status = status;

    const courses = await this.prisma.course.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      status: 'success',
      results: courses.length,
      data: { courses },
    };
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      status: 'success',
      data: { course },
    };
  }

  async create(createCourseDto: CreateCourseDto) {
    const course = await this.prisma.course.create({
      data: createCourseDto as any,
    });

    return {
      status: 'success',
      data: { course },
    };
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto as any,
    });

    return {
      status: 'success',
      data: { course: updatedCourse },
    };
  }

  async remove(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.prisma.course.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Course deleted',
    };
  }

  async enrollStudent(id: number, studentId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const enrolledStudents = (course.enrolledStudents as number[]) || [];
    if (enrolledStudents.includes(studentId)) {
      throw new BadRequestException('Student already enrolled');
    }

    enrolledStudents.push(studentId);
    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: { enrolledStudents },
    });

    return {
      status: 'success',
      data: { course: updatedCourse },
    };
  }
}
