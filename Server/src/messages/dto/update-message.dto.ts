import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false, type: [Object] })
  @IsOptional()
  @IsArray()
  attachments?: any[];

  @ApiProperty({ required: false, enum: ['low', 'normal', 'high'] })
  @IsOptional()
  @IsEnum(['low', 'normal', 'high'])
  priority?: string;

  @ApiProperty({ required: false, enum: ['academic', 'administrative', 'general', 'urgent'] })
  @IsOptional()
  @IsEnum(['academic', 'administrative', 'general', 'urgent'])
  category?: string;
}
