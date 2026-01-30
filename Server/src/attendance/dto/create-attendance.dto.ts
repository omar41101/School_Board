import { IsNotEmpty, IsInt, IsEnum, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  courseId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ enum: ['present', 'absent', 'late', 'excused'] })
  @IsNotEmpty()
  @IsEnum(['present', 'absent', 'late', 'excused'])
  status: string;

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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @ApiProperty({ enum: ['S1', 'S2', 'Summer'] })
  @IsNotEmpty()
  @IsEnum(['S1', 'S2', 'Summer'])
  semester: string;
}
