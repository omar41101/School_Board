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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentsService = class StudentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { level, className, status, page = 1, limit = 10 } = query;
        const where = {};
        if (level)
            where.level = level;
        if (className)
            where.className = className;
        if (status)
            where.status = status;
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
    async findByUserId(userId) {
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
            throw new common_1.NotFoundException('Student not found');
        }
        return {
            status: 'success',
            data: { student },
        };
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException('Student not found');
        }
        return {
            status: 'success',
            data: { student },
        };
    }
    async create(createStudentDto) {
        const student = await this.prisma.student.create({
            data: createStudentDto,
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
    async update(id, updateStudentDto) {
        const { firstName, lastName, email, phone, avatar, ...studentData } = updateStudentDto;
        const student = await this.prisma.student.findUnique({
            where: { id },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
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
        const updatedStudent = await this.prisma.student.update({
            where: { id },
            data: studentData,
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
    async remove(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        await this.prisma.student.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Student deleted successfully',
        };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map