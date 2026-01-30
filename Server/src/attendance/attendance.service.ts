import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { student, teacher, course, date, status } = query;
    const where: any = {};

    if (student) where.studentId = parseInt(student);
    if (teacher) where.teacherId = parseInt(teacher);
    if (course) where.courseId = parseInt(course);
    if (date) where.date = new Date(date);
    if (status) where.status = status;

    const attendance = await this.prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        teacher: true,
      },
    });

    return {
      status: 'success',
      results: attendance.length,
      data: { attendance },
    };
  }

  async create(createAttendanceDto: CreateAttendanceDto) {
    const attendance = await this.prisma.attendance.create({
      data: {
        ...createAttendanceDto,
        date: createAttendanceDto.date ? new Date(createAttendanceDto.date) : new Date(),
      } as any,
      include: {
        student: true,
        course: true,
        teacher: true,
      },
    });

    return {
      status: 'success',
      data: { attendance },
    };
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    const updatedAttendance = await this.prisma.attendance.update({
      where: { id },
      data: {
        ...updateAttendanceDto,
        ...(updateAttendanceDto.date && { date: new Date(updateAttendanceDto.date) }),
      } as any,
      include: {
        student: true,
        course: true,
        teacher: true,
      },
    });

    return {
      status: 'success',
      data: { attendance: updatedAttendance },
    };
  }

  async remove(id: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    await this.prisma.attendance.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Attendance record deleted',
    };
  }
}
