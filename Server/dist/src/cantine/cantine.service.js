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
exports.CantineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CantineService = class CantineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { student, date, status, mealType } = query;
        const where = {};
        if (student)
            where.studentId = parseInt(student);
        if (date)
            where.date = new Date(date);
        if (status)
            where.status = status;
        if (mealType)
            where.mealType = mealType;
        const orders = await this.prisma.cantine.findMany({
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
            },
        });
        return {
            status: 'success',
            results: orders.length,
            data: { orders },
        };
    }
    async findOne(id) {
        const order = await this.prisma.cantine.findUnique({
            where: { id },
            include: {
                student: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return {
            status: 'success',
            data: { order },
        };
    }
    async create(createCantineDto) {
        const items = createCantineDto.items || [];
        const totalAmount = items.reduce((total, item) => {
            return total + (parseFloat(item.price || 0) * parseInt(item.quantity || 1));
        }, 0);
        const order = await this.prisma.cantine.create({
            data: {
                ...createCantineDto,
                items,
                totalAmount,
                date: createCantineDto.date ? new Date(createCantineDto.date) : new Date(),
            },
            include: {
                student: true,
            },
        });
        return {
            status: 'success',
            data: { order },
        };
    }
    async update(id, updateCantineDto) {
        const order = await this.prisma.cantine.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        let totalAmount = order.totalAmount;
        if (updateCantineDto.items) {
            totalAmount = updateCantineDto.items.reduce((total, item) => {
                return total + (parseFloat(item.price || 0) * parseInt(item.quantity || 1));
            }, 0);
        }
        const updatedOrder = await this.prisma.cantine.update({
            where: { id },
            data: {
                ...updateCantineDto,
                ...(updateCantineDto.items && { items: updateCantineDto.items }),
                totalAmount,
                ...(updateCantineDto.date && { date: new Date(updateCantineDto.date) }),
            },
            include: {
                student: true,
            },
        });
        return {
            status: 'success',
            data: { order: updatedOrder },
        };
    }
    async cancel(id) {
        const order = await this.prisma.cantine.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const updatedOrder = await this.prisma.cantine.update({
            where: { id },
            data: {
                status: 'cancelled',
            },
            include: {
                student: true,
            },
        });
        return {
            status: 'success',
            data: { order: updatedOrder },
        };
    }
    async remove(id) {
        const order = await this.prisma.cantine.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        await this.prisma.cantine.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Order deleted',
        };
    }
};
exports.CantineService = CantineService;
exports.CantineService = CantineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CantineService);
//# sourceMappingURL=cantine.service.js.map