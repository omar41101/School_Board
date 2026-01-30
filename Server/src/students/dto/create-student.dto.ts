import { IsNotEmpty, IsString, IsEnum, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  matricule: string;

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
  level: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  className: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  parentId?: number;

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
}
