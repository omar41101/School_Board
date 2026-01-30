import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { level, subject, status, student, teacher, page = 1, limit = 10 } = query;
    const where: any = {};

    if (level) where.level = level;
    if (subject) where.subject = subject;
    if (status) where.status = status;
    if (teacher) where.teacherId = parseInt(teacher);

    let courses = await this.prisma.course.findMany({
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
      orderBy: { createdAt: 'desc' },
    });

    // Filter by student enrollment (enrolledStudents is JSON array of student IDs)
    if (student) {
      const studentId = parseInt(student);
      courses = courses.filter(
        (c) => (c.enrolledStudents as number[] | null)?.includes(studentId) ?? false,
      );
    }

    const total = courses.length;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const paginatedCourses = courses.slice(skip, skip + take);

    return {
      status: 'success',
      results: paginatedCourses.length,
      total,
      totalPages: Math.ceil(total / take),
      currentPage: Number(page),
      data: { courses: paginatedCourses },
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
