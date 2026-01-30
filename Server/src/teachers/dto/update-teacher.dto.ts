import { IsOptional, IsString, IsNumber, IsInt, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeacherDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  salary?: number;

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
  classes?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  schedule?: any[];

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
