import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    return await this.roleRepository.create(dto);
  }

  async getRoleByValue(value: string) {
    return await this.roleRepository.findOne({ where: { value } });
  }

  async seedRoles() {
    const roles = [
      { value: 'USER', description: 'Regular user' },
      { value: 'ADMIN', description: 'Administrator' },
      { value: 'MODERATOR', description: 'Moderator' },
    ];

    for (const roleData of roles) {
      const roleExists = await this.roleRepository.findOne({
        where: { value: roleData.value },
      });
      if (!roleExists) {
        await this.roleRepository.create(roleData);
      }
    }
  }
}
