import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { student, status, type } = query;
    const where: any = {};
    
    if (student) where.studentId = parseInt(student);
    if (status) where.status = status;
    if (type) where.type = type;

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

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      status: 'success',
      data: { payment },
    };
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = await this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        dueDate: new Date(createPaymentDto.dueDate),
        ...(createPaymentDto.paidDate && { paidDate: new Date(createPaymentDto.paidDate) }),
      } as any,
      include: {
        student: true,
      },
    });

    return {
      status: 'success',
      data: { payment },
    };
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
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
      } as any,
      include: {
        student: true,
      },
    });

    return {
      status: 'success',
      data: { payment: updatedPayment },
    };
  }

  async markAsPaid(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
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

  async remove(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Payment deleted',
    };
  }
}
