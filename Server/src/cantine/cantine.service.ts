import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCantineDto } from './dto/create-cantine.dto';
import { UpdateCantineDto } from './dto/update-cantine.dto';

@Injectable()
export class CantineService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { student, date, status, mealType } = query;
    const where: any = {};
    
    if (student) where.studentId = parseInt(student);
    if (date) where.date = new Date(date);
    if (status) where.status = status;
    if (mealType) where.mealType = mealType;

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

  async findOne(id: number) {
    const order = await this.prisma.cantine.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      status: 'success',
      data: { order },
    };
  }

  async create(createCantineDto: CreateCantineDto) {
    const items = createCantineDto.items || [];
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (parseFloat(item.price || 0) * parseInt(item.quantity || 1));
    }, 0);

    const order = await this.prisma.cantine.create({
      data: {
        ...createCantineDto,
        items,
        totalAmount,
        date: createCantineDto.date ? new Date(createCantineDto.date) : new Date(),
      } as any,
      include: {
        student: true,
      },
    });

    return {
      status: 'success',
      data: { order },
    };
  }

  async update(id: number, updateCantineDto: UpdateCantineDto) {
    const order = await this.prisma.cantine.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    let totalAmount = order.totalAmount;
    if (updateCantineDto.items) {
      totalAmount = updateCantineDto.items.reduce((total: number, item: any) => {
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
      } as any,
      include: {
        student: true,
      },
    });

    return {
      status: 'success',
      data: { order: updatedOrder },
    };
  }

  async cancel(id: number) {
    const order = await this.prisma.cantine.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
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

  async remove(id: number) {
    const order = await this.prisma.cantine.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.prisma.cantine.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Order deleted',
    };
  }
}
