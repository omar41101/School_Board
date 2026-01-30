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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttendanceService = class AttendanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { student, date, status } = query;
        const where = {};
        if (student)
            where.studentId = parseInt(student);
        if (date)
            where.date = new Date(date);
        if (status)
            where.status = status;
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
    async create(createAttendanceDto) {
        const attendance = await this.prisma.attendance.create({
            data: {
                ...createAttendanceDto,
                date: createAttendanceDto.date ? new Date(createAttendanceDto.date) : new Date(),
            },
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
    async update(id, updateAttendanceDto) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
        });
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        const updatedAttendance = await this.prisma.attendance.update({
            where: { id },
            data: {
                ...updateAttendanceDto,
                ...(updateAttendanceDto.date && { date: new Date(updateAttendanceDto.date) }),
            },
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
    async remove(id) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
        });
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        await this.prisma.attendance.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Attendance record deleted',
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map