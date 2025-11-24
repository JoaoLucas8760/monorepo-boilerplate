import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  @Post()
  @Roles('admin')
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    const user = await this.usersService.update(id, userData);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}


