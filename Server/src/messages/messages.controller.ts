import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all messages (inbox, sent, or all)' })
  findAll(
    @Query() query: { inbox?: string; sent?: string; page?: string; limit?: string },
    @GetUser('id') userId: number,
  ) {
    const params = {
      inbox: query.inbox === 'true',
      sent: query.sent === 'true',
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    };
    return this.messagesService.findAll(params, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.messagesService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create message' })
  create(@Body() createMessageDto: CreateMessageDto, @GetUser('id') userId: number) {
    return this.messagesService.create(createMessageDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update message' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMessageDto: UpdateMessageDto, @GetUser('id') userId: number) {
    return this.messagesService.update(id, updateMessageDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete message' })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.messagesService.remove(id, userId);
  }
}
