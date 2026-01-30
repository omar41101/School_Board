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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { level, subject, status } = query;
        const where = {};
        if (level)
            where.level = level;
        if (subject)
            where.subject = subject;
        if (status)
            where.status = status;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Course not found');
        }
        return {
            status: 'success',
            data: { course },
        };
    }
    async create(createCourseDto) {
        const course = await this.prisma.course.create({
            data: createCourseDto,
        });
        return {
            status: 'success',
            data: { course },
        };
    }
    async update(id, updateCourseDto) {
        const course = await this.prisma.course.findUnique({
            where: { id },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const updatedCourse = await this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
        });
        return {
            status: 'success',
            data: { course: updatedCourse },
        };
    }
    async remove(id) {
        const course = await this.prisma.course.findUnique({
            where: { id },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        await this.prisma.course.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Course deleted',
        };
    }
    async enrollStudent(id, studentId) {
        const course = await this.prisma.course.findUnique({
            where: { id },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const enrolledStudents = course.enrolledStudents || [];
        if (enrolledStudents.includes(studentId)) {
            throw new common_1.BadRequestException('Student already enrolled');
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
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map