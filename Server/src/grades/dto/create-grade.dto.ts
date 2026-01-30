import { IsNotEmpty, IsInt, IsEnum, IsString, IsDateString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  courseId: number;

  @ApiProperty({ enum: ['quiz', 'midterm', 'final', 'assignment', 'project', 'practical'] })
  @IsNotEmpty()
  @IsEnum(['quiz', 'midterm', 'final', 'assignment', 'project', 'practical'])
  examType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  marks: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalMarks: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  teacherId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @ApiProperty({ enum: ['S1', 'S2', 'Summer'] })
  @IsNotEmpty()
  @IsEnum(['S1', 'S2', 'Summer'])
  semester: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  examDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}
