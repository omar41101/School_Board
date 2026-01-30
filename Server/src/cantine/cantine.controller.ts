import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CantineService } from './cantine.service';
import { CreateCantineDto } from './dto/create-cantine.dto';
import { UpdateCantineDto } from './dto/update-cantine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';

@ApiTags('Cantine')
@Controller('cantine')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CantineController {
  constructor(private readonly cantineService: CantineService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cantine orders' })
  findAll(@Query() query: any) {
    return this.cantineService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cantine order by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cantineService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin, Role.Student, Role.Parent)
  @ApiOperation({ summary: 'Create cantine order' })
  create(@Body() createCantineDto: CreateCantineDto) {
    return this.cantineService.create(createCantineDto);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update cantine order (Admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCantineDto: UpdateCantineDto) {
    return this.cantineService.update(id, updateCantineDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel cantine order' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.cantineService.cancel(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete cantine order (Admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cantineService.remove(id);
  }
}
