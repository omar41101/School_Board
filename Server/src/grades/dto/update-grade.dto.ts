import { IsOptional, IsInt, IsEnum, IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGradeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  studentId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  courseId?: number;

  @ApiProperty({ required: false, enum: ['quiz', 'midterm', 'final', 'assignment', 'project', 'practical'] })
  @IsOptional()
  @IsEnum(['quiz', 'midterm', 'final', 'assignment', 'project', 'practical'])
  examType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  marks?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalMarks?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  teacherId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiProperty({ required: false, enum: ['S1', 'S2', 'Summer'] })
  @IsOptional()
  @IsEnum(['S1', 'S2', 'Summer'])
  semester?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  examDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  percentage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  grade?: string;
}
