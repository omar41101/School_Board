import { IsNotEmpty, IsInt, IsEnum, IsNumber, IsDateString, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @ApiProperty({ enum: ['tuition', 'transport', 'library', 'sports', 'exam', 'hostel', 'other'] })
  @IsNotEmpty()
  @IsEnum(['tuition', 'transport', 'library', 'sports', 'exam', 'hostel', 'other'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ required: false, default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ enum: ['pending', 'paid', 'overdue', 'cancelled', 'refunded'], required: false, default: 'pending' })
  @IsOptional()
  @IsEnum(['pending', 'paid', 'overdue', 'cancelled', 'refunded'])
  status?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @ApiProperty({ required: false, enum: ['cash', 'card', 'bank_transfer', 'cheque', 'online'] })
  @IsOptional()
  @IsEnum(['cash', 'card', 'bank_transfer', 'cheque', 'online'])
  paymentMethod?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @ApiProperty({ required: false, enum: ['S1', 'S2', 'Summer'] })
  @IsOptional()
  @IsEnum(['S1', 'S2', 'Summer'])
  semester?: string;
}
