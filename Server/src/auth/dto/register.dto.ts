import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../decorators/roles.decorator';

class AddressDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

class EmergencyContactDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

class MedicalInfoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  allergies?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  medicalConditions?: string[];

  @ApiProperty({ required: false, type: EmergencyContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
}

class PreviousSchoolDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  year?: string;
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Role, required: false, default: 'student' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  // Student specific fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  matricule?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  className?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  parentId?: number;

  // Teacher specific fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  salary?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  subjects?: string[];

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  experience?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  classes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  schedule?: any;

  // Parent specific fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

  // Common fields
  @ApiProperty({ required: false, type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiProperty({ required: false, type: MedicalInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MedicalInfoDto)
  medicalInfo?: MedicalInfoDto;

  @ApiProperty({ required: false, type: PreviousSchoolDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PreviousSchoolDto)
  previousSchool?: PreviousSchoolDto;

  @ApiProperty({ required: false })
  @IsOptional()
  documents?: any[];

  // Emergency contact for parent registration
  @ApiProperty({ required: false, type: EmergencyContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
}
