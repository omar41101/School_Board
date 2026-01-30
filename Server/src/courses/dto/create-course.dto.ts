import { IsNotEmpty, IsString, IsOptional, IsInt, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  level: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  teacherId?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  credits?: number;

  @ApiProperty({ required: false, default: 30 })
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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @ApiProperty({ enum: ['S1', 'S2', 'Summer'] })
  @IsNotEmpty()
  @IsEnum(['S1', 'S2', 'Summer'])
  semester: string;
}
