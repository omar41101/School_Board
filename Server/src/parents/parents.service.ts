import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any = {}) {
    const { page = 1, limit = 10, search } = query;
    const where: any = {};
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

  async findByUserId(userId: number) {
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
      throw new NotFoundException('Parent not found');
    }

    return {
      status: 'success',
      data: { parent },
    };
  }

  async findOne(id: number) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: {
        user: true,
        children: true,
      },
    });

    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    return {
      status: 'success',
      data: { parent },
    };
  }

  async create(createParentDto: CreateParentDto) {
    const parent = await this.prisma.parent.create({
      data: createParentDto as any,
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

  async update(id: number, updateParentDto: UpdateParentDto) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
    });

    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    const updatedParent = await this.prisma.parent.update({
      where: { id },
      data: updateParentDto as any,
      include: {
        user: true,
      },
    });

    return {
      status: 'success',
      data: { parent: updatedParent },
    };
  }

  async remove(id: number) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
    });

    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    await this.prisma.parent.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Parent deleted',
    };
  }
}
