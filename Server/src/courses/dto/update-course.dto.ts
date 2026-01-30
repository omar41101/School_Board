import { IsOptional, IsString, IsInt, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  teacherId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  credits?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  maxStudents?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  enrolledStudents?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  schedule?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  syllabus?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiProperty({ required: false, enum: ['S1', 'S2', 'Summer'] })
  @IsOptional()
  @IsEnum(['S1', 'S2', 'Summer'])
  semester?: string;
}
