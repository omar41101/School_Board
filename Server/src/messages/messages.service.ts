import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { inbox?: boolean; sent?: boolean; page?: number; limit?: number }, userId: number) {
    const { inbox, sent, page = 1, limit = 20 } = query;
    const where: Record<string, unknown> = {};

    if (inbox === true) {
      where.recipientId = userId;
    } else if (sent === true) {
      where.senderId = userId;
    } else {
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
      this.prisma.message.count({ where: where as any }),
    ]);

    return {
      status: 'success',
      results: messages.length,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      data: { messages },
    };
  }

  async findOne(id: number, userId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: true,
        recipient: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId && message.recipientId !== userId) {
      throw new NotFoundException('Message not found');
    }

    // Mark as read if recipient is viewing
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

  async create(createMessageDto: CreateMessageDto, senderId: number) {
    const message = await this.prisma.message.create({
      data: {
        ...createMessageDto,
        senderId,
        attachments: createMessageDto.attachments || [],
      } as any,
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

  async update(id: number, updateMessageDto: UpdateMessageDto, userId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new NotFoundException('You can only update your own messages');
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id },
      data: updateMessageDto as any,
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

  async remove(id: number, userId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId && message.recipientId !== userId) {
      throw new NotFoundException('Message not found');
    }

    await this.prisma.message.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Message deleted',
    };
  }
}
