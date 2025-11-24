import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '../entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('admin')
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string): Promise<Role> {
    const role = await this.rolesService.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role com ID ${id} não encontrado`);
    }
    return role;
  }

  @Post()
  @Roles('admin')
  async create(@Body() roleData: Partial<Role>): Promise<Role> {
    return this.rolesService.create(roleData);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() roleData: Partial<Role>,
  ): Promise<Role> {
    const role = await this.rolesService.update(id, roleData);
    if (!role) {
      throw new NotFoundException(`Role com ID ${id} não encontrado`);
    }
    return role;
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(id);
  }
}

