import { IsOptional, IsString, IsEnum, IsDateString, IsArray, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: ['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'] })
  @IsOptional()
  @IsEnum(['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'])
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  participants?: number[];

  @ApiProperty({ required: false, enum: ['all', 'students', 'teachers', 'parents', 'staff'] })
  @IsOptional()
  @IsEnum(['all', 'students', 'teachers', 'parents', 'staff'])
  targetAudience?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  levels?: string[];

  @ApiProperty({ required: false, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'] })
  @IsOptional()
  @IsEnum(['scheduled', 'ongoing', 'completed', 'cancelled'])
  status?: string;

  @ApiProperty({ required: false })
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
