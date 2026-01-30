import { IsOptional, IsInt, IsEnum, IsDateString, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCantineDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  studentId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false, enum: ['breakfast', 'lunch', 'snack', 'dinner'] })
  @IsOptional()
  @IsEnum(['breakfast', 'lunch', 'snack', 'dinner'])
  mealType?: string;

  @ApiProperty({ required: false, type: [Object] })
  @IsOptional()
  @IsArray()
  items?: any[];

  @ApiProperty({ required: false, enum: ['pending', 'confirmed', 'served', 'cancelled'] })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'served', 'cancelled'])
  status?: string;

  @ApiProperty({ required: false, enum: ['pending', 'paid'] })
  @IsOptional()
  @IsEnum(['pending', 'paid'])
  paymentStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
