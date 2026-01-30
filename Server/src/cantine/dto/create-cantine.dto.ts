import { IsNotEmpty, IsInt, IsEnum, IsDateString, IsOptional, IsArray, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCantineDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ enum: ['breakfast', 'lunch', 'snack', 'dinner'] })
  @IsNotEmpty()
  @IsEnum(['breakfast', 'lunch', 'snack', 'dinner'])
  mealType: string;

  @ApiProperty({ type: [Object] })
  @IsNotEmpty()
  @IsArray()
  items: any[];

  @ApiProperty({ required: false, enum: ['pending', 'confirmed', 'served', 'cancelled'], default: 'pending' })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'served', 'cancelled'])
  status?: string;

  @ApiProperty({ required: false, enum: ['pending', 'paid'], default: 'pending' })
  @IsOptional()
  @IsEnum(['pending', 'paid'])
  paymentStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
