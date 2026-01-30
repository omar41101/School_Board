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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { student, status, type } = query;
        const where = {};
        if (student)
            where.studentId = parseInt(student);
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        const payments = await this.prisma.payment.findMany({
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
            results: payments.length,
            data: { payments },
        };
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                student: true,
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return {
            status: 'success',
            data: { payment },
        };
    }
    async create(createPaymentDto) {
        const payment = await this.prisma.payment.create({
            data: {
                ...createPaymentDto,
                dueDate: new Date(createPaymentDto.dueDate),
                ...(createPaymentDto.paidDate && { paidDate: new Date(createPaymentDto.paidDate) }),
            },
            include: {
                student: true,
            },
        });
        return {
            status: 'success',
            data: { payment },
        };
    }
    async update(id, updatePaymentDto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id },
            data: {
                ...updatePaymentDto,
                ...(updatePaymentDto.dueDate && { dueDate: new Date(updatePaymentDto.dueDate) }),
                ...(updatePaymentDto.paidDate && { paidDate: new Date(updatePaymentDto.paidDate) }),
                ...(updatePaymentDto.status === 'paid' && !payment.receiptNumber && {
                    receiptNumber: `RCP-${Date.now()}`,
                }),
            },
            include: {
                student: true,
            },
        });
        return {
            status: 'success',
            data: { payment: updatedPayment },
        };
    }
    async markAsPaid(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: 'paid',
                paidDate: new Date(),
                ...(!payment.receiptNumber && { receiptNumber: `RCP-${Date.now()}` }),
            },
            include: {
                student: true,
            },
        });
        return {
            status: 'success',
            data: { payment: updatedPayment },
        };
    }
    async remove(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        await this.prisma.payment.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Payment deleted',
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map