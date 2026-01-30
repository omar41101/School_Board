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
exports.ParentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ParentsService = class ParentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query = {}) {
        const { page = 1, limit = 10, search } = query;
        const where = {};
        if (search) {
            where.user = {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const [parents, total] = await Promise.all([
            this.prisma.parent.findMany({
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
                    children: true,
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.parent.count({ where }),
        ]);
        return {
            status: 'success',
            results: parents.length,
            total,
            totalPages: Math.ceil(total / take),
            currentPage: Number(page),
            data: { parents },
        };
    }
    async findByUserId(userId) {
        const parent = await this.prisma.parent.findFirst({
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
                children: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Parent not found');
        }
        return {
            status: 'success',
            data: { parent },
        };
    }
    async findOne(id) {
        const parent = await this.prisma.parent.findUnique({
            where: { id },
            include: {
                user: true,
                children: true,
            },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Parent not found');
        }
        return {
            status: 'success',
            data: { parent },
        };
    }
    async create(createParentDto) {
        const parent = await this.prisma.parent.create({
            data: createParentDto,
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
            data: { parent },
        };
    }
    async update(id, updateParentDto) {
        const parent = await this.prisma.parent.findUnique({
            where: { id },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Parent not found');
        }
        const updatedParent = await this.prisma.parent.update({
            where: { id },
            data: updateParentDto,
            include: {
                user: true,
            },
        });
        return {
            status: 'success',
            data: { parent: updatedParent },
        };
    }
    async remove(id) {
        const parent = await this.prisma.parent.findUnique({
            where: { id },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Parent not found');
        }
        await this.prisma.parent.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Parent deleted',
        };
    }
};
exports.ParentsService = ParentsService;
exports.ParentsService = ParentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParentsService);
//# sourceMappingURL=parents.service.js.map