import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user-dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from '../roles/dto/add-role.dto';
import { Role } from '../roles/roles.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async getUsers() {
    return await this.userRepository.findAll({ include: { all: true } });
  }

  async createUser(dto: CreateUserDto) {
    const role = await this.rolesService.getRoleByValue('ADMIN');
    if (!role) {
      throw new Error('Role USER not found');
    }
    const newUser = await this.userRepository.create(dto);
    await newUser.$set('roles', role.id);
    newUser.roles = [role];
    console.log('Created user', newUser);
    return newUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    console.log('user by email', user);
    return user;
  }


  async getUserById(id: number) {
    return await this.userRepository.findByPk(id, { include: [Role] });
  }


  async updateUser(id: number, data: Partial<User>) {
    await this.userRepository.update(data, { where: { id } });
    return this.getUserById(id);
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$add('roles', role.id);
      return dto;
    }

    throw new HttpException('User or Role not found', HttpStatus.NOT_FOUND);
  }
}
