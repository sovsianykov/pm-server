import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async getUsers() {
    return await this.userRepository.findAll();
  }

  async clearUser(dto: CreateUserDto) {
    const newUser = await this.userRepository.create(dto);
    return newUser;
  }
}
