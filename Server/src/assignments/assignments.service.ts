import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const { course, courseIds } = query || {};
    const where: any = {};

    if (course) {
      where.courseId = parseInt(course);
    } else if (courseIds) {
      const ids = String(courseIds)
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      if (ids.length > 0) {
        where.courseId = { in: ids };
      }
    }

    const assignments = await this.prisma.assignment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        teacher: {
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
      },
    });

    return {
      status: 'success',
      results: assignments.length,
      data: { assignments },
    };
  }

  async findOne(id: number) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
        teacher: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return {
      status: 'success',
      data: { assignment },
    };
  }

  async create(createAssignmentDto: CreateAssignmentDto) {
    const assignment = await this.prisma.assignment.create({
      data: {
        ...createAssignmentDto,
        dueDate: new Date(createAssignmentDto.dueDate),
        attachments: createAssignmentDto.attachments || [],
        submissions: [],
      } as any,
      include: {
        course: true,
        teacher: true,
      },
    });

    return {
      status: 'success',
      data: { assignment },
    };
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const updatedAssignment = await this.prisma.assignment.update({
      where: { id },
      data: {
        ...updateAssignmentDto,
        ...(updateAssignmentDto.dueDate && { dueDate: new Date(updateAssignmentDto.dueDate) }),
      } as any,
      include: {
        course: true,
        teacher: true,
      },
    });

    return {
      status: 'success',
      data: { assignment: updatedAssignment },
    };
  }

  async remove(id: number) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.prisma.assignment.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Assignment deleted',
    };
  }
}
