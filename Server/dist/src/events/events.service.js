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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { type, status, startDate, endDate } = query;
        const where = {};
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (startDate)
            where.startDate = { gte: new Date(startDate) };
        if (endDate)
            where.endDate = { lte: new Date(endDate) };
        const events = await this.prisma.event.findMany({
            where,
            include: {
                organizer: {
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
            results: events.length,
            data: { events },
        };
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                organizer: true,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return {
            status: 'success',
            data: { event },
        };
    }
    async create(createEventDto, organizerId) {
        const event = await this.prisma.event.create({
            data: {
                ...createEventDto,
                organizerId,
                startDate: new Date(createEventDto.startDate),
                endDate: new Date(createEventDto.endDate),
                participants: createEventDto.participants || [],
                levels: createEventDto.levels || [],
                attachments: createEventDto.attachments || [],
            },
            include: {
                organizer: true,
            },
        });
        return {
            status: 'success',
            data: { event },
        };
    }
    async update(id, updateEventDto) {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const updatedEvent = await this.prisma.event.update({
            where: { id },
            data: {
                ...updateEventDto,
                ...(updateEventDto.startDate && { startDate: new Date(updateEventDto.startDate) }),
                ...(updateEventDto.endDate && { endDate: new Date(updateEventDto.endDate) }),
            },
            include: {
                organizer: true,
            },
        });
        return {
            status: 'success',
            data: { event: updatedEvent },
        };
    }
    async remove(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        await this.prisma.event.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Event deleted',
        };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map