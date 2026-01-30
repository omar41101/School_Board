import { IsNotEmpty, IsString, IsEnum, IsDateString, IsOptional, IsArray, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'] })
  @IsNotEmpty()
  @IsEnum(['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  participants?: number[];

  @ApiProperty({ required: false, enum: ['all', 'students', 'teachers', 'parents', 'staff'], default: 'all' })
  @IsOptional()
  @IsEnum(['all', 'students', 'teachers', 'parents', 'staff'])
  targetAudience?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  levels?: string[];

  @ApiProperty({ required: false, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' })
  @IsOptional()
  @IsEnum(['scheduled', 'ongoing', 'completed', 'cancelled'])
  status?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: false, type: [Object] })
  @IsOptional()
  @IsArray()
  attachments?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  maxParticipants?: number;
}
