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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeachersService = class TeachersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findByUserId(userId) {
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
            throw new common_1.NotFoundException('Teacher not found');
        }
        return {
            status: 'success',
            data: { teacher },
        };
    }
    async findOne(id) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
        if (!teacher) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        return {
            status: 'success',
            data: { teacher },
        };
    }
    async create(createTeacherDto) {
        const teacher = await this.prisma.teacher.create({
            data: createTeacherDto,
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
    async update(id, updateTeacherDto) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
        });
        if (!teacher) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        const updatedTeacher = await this.prisma.teacher.update({
            where: { id },
            data: updateTeacherDto,
            include: {
                user: true,
            },
        });
        return {
            status: 'success',
            data: { teacher: updatedTeacher },
        };
    }
    async remove(id) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
        });
        if (!teacher) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        await this.prisma.teacher.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Teacher deleted',
        };
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map