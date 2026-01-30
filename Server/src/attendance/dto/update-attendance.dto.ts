import { IsOptional, IsInt, IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAttendanceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  studentId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  courseId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false, enum: ['present', 'absent', 'late', 'excused'] })
  @IsOptional()
  @IsEnum(['present', 'absent', 'late', 'excused'])
  status?: string;

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
