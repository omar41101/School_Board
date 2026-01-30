"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GradesService = class GradesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { student, course, teacher, academicYear, semester } = query;
        const where = {};
        if (student)
            where.studentId = parseInt(student);
        if (course)
            where.courseId = parseInt(course);
        if (teacher)
            where.teacherId = parseInt(teacher);
        if (academicYear)
            where.academicYear = academicYear;
        if (semester)
            where.semester = semester;
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
    async findOne(id) {
        const grade = await this.prisma.grade.findUnique({
            where: { id },
            include: {
                student: true,
                course: true,
                teacher: true,
            },
        });
        if (!grade) {
            throw new common_1.NotFoundException('Grade not found');
        }
        return {
            status: 'success',
            data: { grade },
        };
    }
    async create(createGradeDto) {
        const { marks, totalMarks } = createGradeDto;
        const percentage = (marks / totalMarks) * 100;
        let grade;
        if (percentage >= 90)
            grade = 'A_PLUS';
        else if (percentage >= 85)
            grade = 'A';
        else if (percentage >= 80)
            grade = 'B_PLUS';
        else if (percentage >= 70)
            grade = 'B';
        else if (percentage >= 65)
            grade = 'C_PLUS';
        else if (percentage >= 60)
            grade = 'C';
        else if (percentage >= 50)
            grade = 'D';
        else
            grade = 'F';
        const newGrade = await this.prisma.grade.create({
            data: {
                ...createGradeDto,
                percentage,
                grade: grade,
                examDate: new Date(createGradeDto.examDate),
            },
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
    async update(id, updateGradeDto) {
        const { percentage, grade: _grade, marks, totalMarks, ...updateData } = updateGradeDto;
        const grade = await this.prisma.grade.findUnique({
            where: { id },
        });
        if (!grade) {
            throw new common_1.NotFoundException('Grade not found');
        }
        let calculatedPercentage = percentage;
        let calculatedGrade = _grade;
        if (marks !== undefined && totalMarks !== undefined) {
            calculatedPercentage = (marks / totalMarks) * 100;
            if (calculatedPercentage >= 90)
                calculatedGrade = 'A_PLUS';
            else if (calculatedPercentage >= 85)
                calculatedGrade = 'A';
            else if (calculatedPercentage >= 80)
                calculatedGrade = 'B_PLUS';
            else if (calculatedPercentage >= 70)
                calculatedGrade = 'B';
            else if (calculatedPercentage >= 65)
                calculatedGrade = 'C_PLUS';
            else if (calculatedPercentage >= 60)
                calculatedGrade = 'C';
            else if (calculatedPercentage >= 50)
                calculatedGrade = 'D';
            else
                calculatedGrade = 'F';
        }
        const updatedGrade = await this.prisma.grade.update({
            where: { id },
            data: {
                ...updateData,
                ...(marks !== undefined && { marks }),
                ...(totalMarks !== undefined && { totalMarks }),
                ...(calculatedPercentage !== undefined && { percentage: calculatedPercentage }),
                ...(calculatedGrade && { grade: calculatedGrade }),
            },
        });
        return {
            status: 'success',
            data: { grade: updatedGrade },
        };
    }
    async remove(id) {
        const grade = await this.prisma.grade.findUnique({
            where: { id },
        });
        if (!grade) {
            throw new common_1.NotFoundException('Grade not found');
        }
        await this.prisma.grade.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Grade deleted',
        };
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradesService);
//# sourceMappingURL=grades.service.js.map