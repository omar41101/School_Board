import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { type, status, startDate, endDate, organizerId } = query;
    const where: any = {};
    
    if (type) where.type = type;
    if (status) where.status = status;
    if (organizerId) where.organizerId = parseInt(organizerId);
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

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

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      status: 'success',
      data: { event },
    };
  }

  async create(createEventDto: CreateEventDto, organizerId: number) {
    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        organizerId,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate),
        participants: createEventDto.participants || [],
        levels: createEventDto.levels || [],
        attachments: createEventDto.attachments || [],
      } as any,
      include: {
        organizer: true,
      },
    });

    return {
      status: 'success',
      data: { event },
    };
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        ...(updateEventDto.startDate && { startDate: new Date(updateEventDto.startDate) }),
        ...(updateEventDto.endDate && { endDate: new Date(updateEventDto.endDate) }),
      } as any,
      include: {
        organizer: true,
      },
    });

    return {
      status: 'success',
      data: { event: updatedEvent },
    };
  }

  async remove(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Event deleted',
    };
  }
}
