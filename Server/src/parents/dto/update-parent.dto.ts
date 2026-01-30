import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParentDto {
  @ApiProperty({ required: false, enum: ['father', 'mother', 'guardian'] })
  @IsOptional()
  @IsEnum(['father', 'mother', 'guardian'])
  relationship?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

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
  emergencyContactName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  emergencyContactRelationship?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  emergencyContactPhone?: string;
}
