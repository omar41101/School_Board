import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  studentId: number;
}
