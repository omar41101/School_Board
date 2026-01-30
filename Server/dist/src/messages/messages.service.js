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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query, userId) {
        const { inbox, sent, page = 1, limit = 20 } = query;
        const where = {};
        if (inbox === true) {
            where.recipientId = userId;
        }
        else if (sent === true) {
            where.senderId = userId;
        }
        else {
            where.OR = [
                { recipientId: userId },
                { senderId: userId },
            ];
        }
        const skip = (page - 1) * limit;
        const take = Number(limit);
        const [messages, total] = await Promise.all([
            this.prisma.message.findMany({
                where,
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                    recipient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.message.count({ where: where }),
        ]);
        return {
            status: 'success',
            results: messages.length,
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: page,
            data: { messages },
        };
    }
    async findOne(id, userId) {
        const message = await this.prisma.message.findUnique({
            where: { id },
            include: {
                sender: true,
                recipient: true,
            },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.senderId !== userId && message.recipientId !== userId) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.recipientId === userId && !message.isRead) {
            await this.prisma.message.update({
                where: { id },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
            message.isRead = true;
            message.readAt = new Date();
        }
        return {
            status: 'success',
            data: { message },
        };
    }
    async create(createMessageDto, senderId) {
        const message = await this.prisma.message.create({
            data: {
                ...createMessageDto,
                senderId,
                attachments: createMessageDto.attachments || [],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return {
            status: 'success',
            data: { message },
        };
    }
    async update(id, updateMessageDto, userId) {
        const message = await this.prisma.message.findUnique({
            where: { id },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.senderId !== userId) {
            throw new common_1.NotFoundException('You can only update your own messages');
        }
        const updatedMessage = await this.prisma.message.update({
            where: { id },
            data: updateMessageDto,
            include: {
                sender: true,
                recipient: true,
            },
        });
        return {
            status: 'success',
            data: { message: updatedMessage },
        };
    }
    async remove(id, userId) {
        const message = await this.prisma.message.findUnique({
            where: { id },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.senderId !== userId && message.recipientId !== userId) {
            throw new common_1.NotFoundException('Message not found');
        }
        await this.prisma.message.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Message deleted',
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map