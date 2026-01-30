import { IsNotEmpty, IsInt, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  recipientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ required: false, type: [Object] })
  @IsOptional()
  @IsArray()
  attachments?: Array<Record<string, unknown>>;

  @ApiProperty({ required: false, enum: ['low', 'normal', 'high'], default: 'normal' })
  @IsOptional()
  @IsEnum(['low', 'normal', 'high'])
  priority?: string;

  @ApiProperty({ required: false, enum: ['academic', 'administrative', 'general', 'urgent'], default: 'general' })
  @IsOptional()
  @IsEnum(['academic', 'administrative', 'general', 'urgent'])
  category?: string;
}
