import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRoles])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
