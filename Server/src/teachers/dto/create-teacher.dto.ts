import { IsNotEmpty, IsString, IsEnum, IsOptional, IsInt, IsDateString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: ['male', 'female'] })
  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  qualification: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  specialization: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  subjects?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  experience?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  addressStreet?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  addressCity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  addressState?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  addressZipCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  addressCountry?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  classes?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  schedule?: any[];
}
