import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user-dto';
import { RolesService } from '../roles/roles.service';
import { UserRoles } from '../roles/user-roles.model';

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
    const role = await this.rolesService.getRoleByValue('USER');
    if (!role) {
      throw new Error('Role USER not found');
    }
    const newUser = await this.userRepository.create(dto);
    await newUser.$set('roles', role.id);

    return newUser;
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }
}
