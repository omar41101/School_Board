import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { student, course, teacher, academicYear, semester } = query;
    const where: any = {};

    if (student) where.studentId = parseInt(student);
    if (course) where.courseId = parseInt(course);
    if (teacher) where.teacherId = parseInt(teacher);
    if (academicYear) where.academicYear = academicYear;
    if (semester) where.semester = semester;

    const grades = await this.prisma.grade.findMany({
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
      results: grades.length,
      data: { grades },
    };
  }

  async findOne(id: number) {
    const grade = await this.prisma.grade.findUnique({
      where: { id },
      include: {
        student: true,
        course: true,
        teacher: true,
      },
    });

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    return {
      status: 'success',
      data: { grade },
    };
  }

  async create(createGradeDto: CreateGradeDto) {
    const { marks, totalMarks } = createGradeDto;
    const percentage = (marks / totalMarks) * 100;
    
    let grade: string;
    if (percentage >= 90) grade = 'A_PLUS';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 80) grade = 'B_PLUS';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 65) grade = 'C_PLUS';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';
    else grade = 'F';

    const newGrade = await this.prisma.grade.create({
      data: {
        ...createGradeDto,
        percentage,
        grade: grade as any,
        examDate: new Date(createGradeDto.examDate),
      } as any,
      include: {
        student: true,
        course: true,
        teacher: true,
      },
    });

    return {
      status: 'success',
      data: { grade: newGrade },
    };
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    const { percentage, grade: _grade, marks, totalMarks, ...updateData } = updateGradeDto;

    const grade = await this.prisma.grade.findUnique({
      where: { id },
    });

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    let calculatedPercentage = percentage;
    let calculatedGrade = _grade;

    if (marks !== undefined && totalMarks !== undefined) {
      calculatedPercentage = (marks / totalMarks) * 100;
      
      if (calculatedPercentage >= 90) calculatedGrade = 'A_PLUS' as any;
      else if (calculatedPercentage >= 85) calculatedGrade = 'A' as any;
      else if (calculatedPercentage >= 80) calculatedGrade = 'B_PLUS' as any;
      else if (calculatedPercentage >= 70) calculatedGrade = 'B' as any;
      else if (calculatedPercentage >= 65) calculatedGrade = 'C_PLUS' as any;
      else if (calculatedPercentage >= 60) calculatedGrade = 'C' as any;
      else if (calculatedPercentage >= 50) calculatedGrade = 'D' as any;
      else calculatedGrade = 'F' as any;
    }

    const updatedGrade = await this.prisma.grade.update({
      where: { id },
      data: {
        ...updateData,
        ...(marks !== undefined && { marks }),
        ...(totalMarks !== undefined && { totalMarks }),
        ...(calculatedPercentage !== undefined && { percentage: calculatedPercentage }),
        ...(calculatedGrade && { grade: calculatedGrade }),
      } as any,
    });

    return {
      status: 'success',
      data: { grade: updatedGrade },
    };
  }

  async remove(id: number, userId?: number) {
    const grade = await this.prisma.grade.findUnique({
      where: { id },
    });

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    if (userId) {
      const teacher = await this.prisma.teacher.findFirst({
        where: { userId },
      });
      if (teacher && grade.teacherId !== teacher.id) {
        throw new NotFoundException('Grade not found or access denied');
      }
    }

    await this.prisma.grade.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Grade deleted',
    };
  }
}
