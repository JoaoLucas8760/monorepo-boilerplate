import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
      select: ['id', 'name', 'email', 'password', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { email: user.email, sub: user.id, roles: user.roles.map(r => r.name) };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
      select: ['id', 'email'],
    });

    if (existingUser) {
      throw new UnauthorizedException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Buscar role padrão 'user'
    const userRole = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });

    if (!userRole) {
      throw new UnauthorizedException('Role padrão não encontrada');
    }

    const user = this.usersRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      isActive: true,
      roles: [userRole],
    });

    const savedUser = await this.usersRepository.save(user);
    
    // Buscar o usuário salvo com relações para retornar
    const userWithRoles = await this.usersRepository.findOne({
      where: { id: savedUser.id },
      relations: ['roles'],
    });

    if (!userWithRoles) {
      throw new UnauthorizedException('Erro ao criar usuário');
    }

    const { password: _, ...result } = userWithRoles;
    return result;
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { password: _, ...result } = user;
    return result;
  }
}

