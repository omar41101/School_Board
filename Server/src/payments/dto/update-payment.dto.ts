import { IsOptional, IsInt, IsEnum, IsNumber, IsDateString, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  studentId?: number;

  @ApiProperty({ required: false, enum: ['tuition', 'transport', 'library', 'sports', 'exam', 'hostel', 'other'] })
  @IsOptional()
  @IsEnum(['tuition', 'transport', 'library', 'sports', 'exam', 'hostel', 'other'])
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false, enum: ['pending', 'paid', 'overdue', 'cancelled', 'refunded'] })
  @IsOptional()
  @IsEnum(['pending', 'paid', 'overdue', 'cancelled', 'refunded'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiProperty({ required: false, enum: ['S1', 'S2', 'Summer'] })
  @IsOptional()
  @IsEnum(['S1', 'S2', 'Summer'])
  semester?: string;
}
