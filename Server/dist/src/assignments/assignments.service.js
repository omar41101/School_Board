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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssignmentsService = class AssignmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const assignments = await this.prisma.assignment.findMany({
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
    async findOne(id) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
            include: {
                course: true,
                teacher: true,
            },
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        return {
            status: 'success',
            data: { assignment },
        };
    }
    async create(createAssignmentDto) {
        const assignment = await this.prisma.assignment.create({
            data: {
                ...createAssignmentDto,
                dueDate: new Date(createAssignmentDto.dueDate),
                attachments: createAssignmentDto.attachments || [],
                submissions: [],
            },
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
    async update(id, updateAssignmentDto) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        const updatedAssignment = await this.prisma.assignment.update({
            where: { id },
            data: {
                ...updateAssignmentDto,
                ...(updateAssignmentDto.dueDate && { dueDate: new Date(updateAssignmentDto.dueDate) }),
            },
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
    async remove(id) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        await this.prisma.assignment.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Assignment deleted',
        };
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map